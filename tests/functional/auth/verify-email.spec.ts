import app from '@adonisjs/core/services/app';
import hash from '@adonisjs/core/services/hash';
import router from '@adonisjs/core/services/router';
import testUtils from '@adonisjs/core/services/test_utils';
import mail from '@adonisjs/mail/services/main';
import { test } from '@japa/runner';
import { DateTime } from 'luxon';

import { UserFactory } from '#database/factories/user-factory';
import VerifyEmailNotification from '#mails/verify-email-notification';
import Token from '#models/token';
import User from '#models/user';
import VerifyEmailService from '#services/verify-email-service';
import env from '#start/env';
import MockVerifyEmailService from '#test-helpers/mocks/mock-verify-email-service';
import { timeTravel } from '#test-helpers/time-travel';
import { NotificationType } from '#types/notification';

test.group('Auth verify email', (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test('POST /auth/verify-email/resend with unknown email returns error', async ({ route, client }) => {
		const { mails } = mail.fake();

		const response = await client
			.post(route('auth.verify-email.resend'))
			.header('referrer', route('auth.login.render'))
			.json({ email: 'wrong@email.fr' })
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'User not found',
			},
		});

		mails.assertNotQueued(VerifyEmailNotification);
	});

	test('POST /auth/verify-email/resend with email from deleted user returns error', async ({ route, client }) => {
		hash.fake();

		const { mails } = mail.fake();

		const user = await UserFactory.apply('deleted').create();
		const response = await client
			.post(route('auth.verify-email.resend'))
			.header('referrer', route('auth.login.render'))
			.json({ email: user.email })
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'User not found',
			},
		});

		mails.assertNotQueued(VerifyEmailNotification);

		hash.restore();
	});

	test('POST /auth/verify-email/resend with email from verified user returns error', async ({ route, client }) => {
		hash.fake();

		const { mails } = mail.fake();

		const user = await UserFactory.apply('verified').create();
		const response = await client
			.post(route('auth.verify-email.resend'))
			.header('referrer', route('auth.login.render'))
			.json({ email: user.email })
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'Your email has already been verified',
			},
		});

		mails.assertNotQueued(VerifyEmailNotification);

		hash.restore();
	});

	test('POST /auth/verify-email/resend with valid payload sends verification email', async ({
		assert,
		route,
		client,
		expect,
	}) => {
		hash.fake();

		const { mails } = mail.fake();

		const mockVerifyEmailService = new MockVerifyEmailService();

		app.container.swap(VerifyEmailService, () => {
			return mockVerifyEmailService;
		});

		const user = await UserFactory.create();
		const response = await client
			.post(route('auth.verify-email.resend'))
			.header('referrer', route('auth.login.render'))
			.json({ email: user.email })
			.withCsrfToken()
			.withInertia();

		expect(mockVerifyEmailService.generateToken).toHaveBeenCalledTimes(1);
		expect(mockVerifyEmailService.clearPreviousToken).toHaveBeenCalledTimes(1);

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));

		const stringToken = (await mockVerifyEmailService.generateToken.mock.results[0].value) as string;

		mails.assertQueued(VerifyEmailNotification, (queuedMail) => {
			queuedMail.message.assertTo(user.email);
			queuedMail.message.assertSubject('Email Verification');

			const verifyEmailUrl = router
				.builder()
				.prefixUrl(env.get('APP_URL'))
				.params({ token: stringToken })
				.make('auth.verify-email.render');

			queuedMail.message.assertTextIncludes(verifyEmailUrl);

			return true;
		});

		const token = await Token.findByOrFail('token', stringToken);
		const updatedUser = await User.findOrFail(user.id);

		assert.equal(token.type, 'verify-email');
		assert.equal(token.userId, updatedUser.id);
		assert.isAbove(token.expiresAt, DateTime.now());

		const userTokens = await updatedUser.related('tokens').query();
		const userVerifyEmailToken = await updatedUser.related('verifyEmailToken').query().firstOrFail();

		assert.notEmpty(userTokens);
		assert.equal(userTokens[0].id, token.id);
		assert.equal(userVerifyEmailToken.id, token.id);

		app.container.restore(VerifyEmailService);
		hash.restore();
	});

	test('GET /auth/verify-email/:token with logged user redirects to home', async ({ client, route }) => {
		hash.fake();

		const verifyEmailService = new VerifyEmailService();
		const user = await UserFactory.create();
		const token = await verifyEmailService.generateToken(user);
		const response = await client.get(route('auth.verify-email.render', { token })).loginAs(user).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});

	test('GET /auth/verify-email/:token without token shows error notification and redirects to /auth/login', async ({
		client,
		route,
	}) => {
		const response = await client.get(route('auth.verify-email.render', { token: '' })).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'Verify email token missing',
			},
		});
	});

	test('GET /auth/verify-email/:token with invalid token shows error notification and redirects to /auth/login', async ({
		client,
		route,
		assert,
		expect,
	}) => {
		const mockVerifyEmailService = new MockVerifyEmailService();

		app.container.swap(VerifyEmailService, () => {
			return mockVerifyEmailService;
		});

		const response = await client.get(route('auth.verify-email.render', { token: 'invalid-token' })).withInertia();

		expect(mockVerifyEmailService.verifyToken).toHaveBeenCalledTimes(1);
		expect(mockVerifyEmailService.verifyToken).toHaveBeenCalledWith('invalid-token');

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'Invalid or expired verify email token',
			},
		});

		assert.isFalse(await mockVerifyEmailService.verifyToken('invalid-token'));

		app.container.restore(VerifyEmailService);
	});

	test('GET /auth/verify-email/:token with expired token shows error notification and redirects to /auth/login', async ({
		client,
		route,
	}) => {
		hash.fake();

		const verifyEmailService = new VerifyEmailService();
		const user = await UserFactory.create();
		const token = await verifyEmailService.generateToken(user);

		timeTravel('1d');

		const response = await client.get(route('auth.verify-email.render', { token })).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'Invalid or expired verify email token',
			},
		});
	});

	test('GET /auth/verify-email/:token with valid token renders auth/verify-email view', async ({ client, route }) => {
		hash.fake();

		const verifyEmailService = new VerifyEmailService();
		const user = await UserFactory.create();
		const token = await verifyEmailService.generateToken(user);
		const response = await client.get(route('auth.verify-email.render', { token })).withInertia();

		response.assertStatus(200);
		response.assertInertiaComponent('auth/verify-email');
		response.assertInertiaProps({ token });

		hash.restore();
	});

	test('POST /auth/verify-email/:token with invalid token shows error notification and redirects to /auth/login', async ({
		client,
		route,
		expect,
		assert,
	}) => {
		const mockVerifyEmailService = new MockVerifyEmailService();

		app.container.swap(VerifyEmailService, () => {
			return mockVerifyEmailService;
		});

		const response = await client
			.post(route('auth.verify-email.handle', { token: 'test' }))
			.header('referrer', route('auth.verify-email.render', { token: 'test' }))
			.json({})
			.withCsrfToken()
			.withInertia();

		expect(mockVerifyEmailService.getUserByToken).toHaveBeenCalledTimes(1);
		expect(mockVerifyEmailService.getUserByToken).toHaveBeenCalledWith('test');

		assert.notExists(await mockVerifyEmailService.getUserByToken('test'));

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'Invalid/expired verify email token or user not found',
			},
		});

		app.container.restore(VerifyEmailService);
	});

	test('POST /auth/verify-email/:token with expired token shows error notification and redirects to /auth/login', async ({
		assert,
		client,
		route,
	}) => {
		hash.fake();

		const verifyEmailService = new VerifyEmailService();
		const user = await UserFactory.create();
		const token = await verifyEmailService.generateToken(user);

		timeTravel('1d');

		const response = await client
			.post(route('auth.verify-email.handle', { token }))
			.header('referrer', route('auth.verify-email.render', { token }))
			.json({})
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'Invalid/expired verify email token or user not found',
			},
		});

		const updatedUser = await User.findOrFail(user.id);

		assert.isFalse(updatedUser.isVerified);

		hash.restore();
	});

	test('POST /auth/verify-email/:token with valid token verify email', async ({ client, route, assert, expect }) => {
		hash.fake();

		const mockVerifyEmailService = new MockVerifyEmailService();

		app.container.swap(VerifyEmailService, () => {
			return mockVerifyEmailService;
		});

		const verifyEmailService = new VerifyEmailService();
		const user = await UserFactory.create();
		const stringToken = await verifyEmailService.generateToken(user);
		const response = await client
			.post(route('auth.verify-email.handle', { token: stringToken }))
			.withCsrfToken()
			.withInertia();

		expect(mockVerifyEmailService.clearPreviousToken).toHaveBeenCalledTimes(1);

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Success,
				message: 'Your email has been successfully verified',
			},
		});

		const updatedUser = await User.findOrFail(user.id);

		assert.isTrue(updatedUser.isVerified);

		const token = await Token.findBy('token', stringToken);
		const userTokens = await updatedUser.related('tokens').query();
		const userVerifyEmailToken = await updatedUser.related('verifyEmailToken').query().first();

		assert.notExists(token);
		assert.empty(userTokens);
		assert.notExists(userVerifyEmailToken);

		app.container.restore(VerifyEmailService);
		hash.restore();
	});

	test('GET /auth/verify-email/:token with used token shows error notification and redirects to /auth/login', async ({
		client,
		route,
	}) => {
		hash.fake();

		const verifyEmailService = new VerifyEmailService();
		const user = await UserFactory.create();
		const token = await verifyEmailService.generateToken(user);

		await client.post(route('auth.verify-email.handle', { token })).withCsrfToken().withInertia();

		const response = await client.get(route('auth.verify-email.render', { token })).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'Invalid or expired verify email token',
			},
		});
	});

	test('GET /auth/verify-email/:token with old token shows error notification and redirects to /auth/login', async ({
		client,
		route,
		assert,
	}) => {
		hash.fake();

		const verifyEmailService = new VerifyEmailService();
		const user = await UserFactory.create();
		const stringToken = await verifyEmailService.generateToken(user);

		await verifyEmailService.generateToken(user);

		const response = await client.get(route('auth.verify-email.render', { token: stringToken })).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'Invalid or expired verify email token',
			},
		});

		const updatedUser = await User.findOrFail(user.id);
		const token = await Token.findBy('token', stringToken);
		const userTokens = await updatedUser.related('tokens').query();
		const userVerifyEmailToken = await updatedUser.related('verifyEmailToken').query().firstOrFail();

		assert.notExists(token);
		assert.notEmpty(userTokens);
		assert.notEqual(userTokens[0].token, stringToken);
		assert.notEqual(userVerifyEmailToken.token, stringToken);
	});

	test('POST /auth/verify-email/:token with used token shows error notification and redirects to /auth/login', async ({
		client,
		route,
		assert,
	}) => {
		hash.fake();

		const verifyEmailService = new VerifyEmailService();
		const user = await UserFactory.create();
		const stringToken = await verifyEmailService.generateToken(user);

		await client
			.post(route('auth.verify-email.handle', { token: stringToken }))
			.withCsrfToken()
			.withInertia();

		const response = await client
			.post(route('auth.verify-email.handle', { token: stringToken }))
			.header('referrer', route('auth.verify-email.render', { token: stringToken }))
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'Invalid/expired verify email token or user not found',
			},
		});

		const updatedUser = await User.findOrFail(user.id);
		const token = await Token.findBy('token', stringToken);
		const userTokens = await updatedUser.related('tokens').query();
		const userVerifyEmailToken = await updatedUser.related('verifyEmailToken').query().first();

		assert.notExists(token);
		assert.empty(userTokens);
		assert.notExists(userVerifyEmailToken);

		hash.restore();
	});

	test('POST /auth/verify-email/:token with old token shows error notification and redirects to /auth/login', async ({
		client,
		route,
		assert,
	}) => {
		hash.fake();

		const verifyEmailService = new VerifyEmailService();
		const user = await UserFactory.create();
		const token = await verifyEmailService.generateToken(user);

		await verifyEmailService.generateToken(user);

		const response = await client
			.post(route('auth.verify-email.handle', { token }))
			.header('referrer', route('auth.verify-email.render', { token }))
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'Invalid/expired verify email token or user not found',
			},
		});

		const updatedUser = await User.findOrFail(user.id);

		assert.isFalse(updatedUser.isVerified);

		hash.restore();
	});
});
