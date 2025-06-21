import app from '@adonisjs/core/services/app';
import hash from '@adonisjs/core/services/hash';
import router from '@adonisjs/core/services/router';
import testUtils from '@adonisjs/core/services/test_utils';
import mail from '@adonisjs/mail/services/main';
import { test } from '@japa/runner';
import { DateTime } from 'luxon';

import { UserFactory } from '#database/factories/user-factory';
import PasswordResetRequestNotification from '#mails/password-reset-request-notification';
import Token from '#models/token';
import User from '#models/user';
import PasswordResetService from '#services/password-reset-service';
import env from '#start/env';
import MockPasswordResetService from '#test-helpers/mocks/mock-password-reset-service';
import { NotificationType } from '#types/notification';

test.group('Auth forgot password', (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test('GET /auth/forgot-password renders auth/forgot-password view', async ({ client, route }) => {
		const response = await client.get(route('auth.forgot-password.renderForgot')).withInertia();

		response.assertStatus(200);
		response.assertInertiaComponent('auth/forgot-password');
		response.assertInertiaProps({});
	});

	test('GET /auth/forgot-password with logged user redirects to home', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		const response = await client.get(route('auth.forgot-password.renderForgot')).loginAs(user).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});

	test('POST /auth/forgot-password with empty body returns validation errors', async ({ client, route }) => {
		const response = await client
			.post(route('auth.forgot-password.sendMail'))
			.header('referrer', route('auth.forgot-password.renderForgot'))
			.json({})
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.forgot-password.renderForgot'));
		response.assertInertiaProps({
			errors: {
				email: 'The email field must be defined',
			},
		});
	});

	test('POST /auth/forgot-password with invalid body returns validation errors', async ({ client, route }) => {
		const response = await client
			.post(route('auth.forgot-password.sendMail'))
			.header('referrer', route('auth.forgot-password.renderForgot'))
			.json({ email: 'not-an-email' })
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.forgot-password.renderForgot'));
		response.assertInertiaProps({
			errors: {
				email: 'The email field must be a valid email address',
			},
		});
	});

	test("POST /auth/forgot-password with email not in database shows email notification but doesn't send email", async ({
		client,
		route,
	}) => {
		const { mails } = mail.fake();

		const response = await client
			.post(route('auth.forgot-password.sendMail'))
			.header('referrer', route('auth.forgot-password.renderForgot'))
			.json({ email: 'test@test.fr' })
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.forgot-password.renderForgot'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Info,
				message:
					'If the email exists in our system, we will send you an email with instructions to reset your password',
			},
		});

		mails.assertNotSent(PasswordResetRequestNotification);
	});

	test('POST /auth/forgot-password with email in database sends email and show email notification', async ({
		client,
		route,
		assert,
		expect,
	}) => {
		hash.fake();

		const { mails } = mail.fake();

		const mockPasswordResetService = new MockPasswordResetService();

		app.container.swap(PasswordResetService, () => {
			return mockPasswordResetService;
		});

		const user = await UserFactory.create();
		const response = await client
			.post(route('auth.forgot-password.sendMail'))
			.header('referrer', route('auth.forgot-password.renderForgot'))
			.json({ email: user.email })
			.withCsrfToken()
			.withInertia();

		expect(mockPasswordResetService.generateToken).toHaveBeenCalledTimes(1);
		expect(mockPasswordResetService.clearPreviousToken).toHaveBeenCalledTimes(1);

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.forgot-password.renderForgot'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Info,
				message:
					'If the email exists in our system, we will send you an email with instructions to reset your password',
			},
		});

		const stringToken = (await mockPasswordResetService.generateToken.mock.results[0].value) as string;

		mails.assertQueued(PasswordResetRequestNotification, (queuedMail) => {
			queuedMail.message.assertTo(user.email);
			queuedMail.message.assertSubject('Password Reset Request');

			const passwordResetUrl = router
				.builder()
				.prefixUrl(env.get('APP_URL'))
				.params({ token: stringToken })
				.make('auth.password-reset.renderReset');

			queuedMail.message.assertTextIncludes(passwordResetUrl);

			return true;
		});

		const token = await Token.findByOrFail('token', stringToken);
		const updatedUser = await User.findOrFail(user.id);

		assert.equal(token.type, 'password-reset');
		assert.equal(token.userId, updatedUser.id);
		assert.isAbove(token.expiresAt, DateTime.now());

		const userTokens = await updatedUser.related('tokens').query();
		const userPasswordResetToken = await updatedUser.related('passwordResetToken').query().firstOrFail();

		assert.notEmpty(userTokens);
		assert.equal(userTokens[0].id, token.id);
		assert.equal(userPasswordResetToken.id, token.id);

		app.container.restore(PasswordResetService);
		hash.restore();
	});

	test("POST /auth/forgot-password with email from a deleted account shows email notification but doesn't send email", async ({
		client,
		route,
	}) => {
		hash.fake();

		const { mails } = mail.fake();

		const user = await UserFactory.apply('test', 'deleted').create();
		const response = await client
			.post(route('auth.forgot-password.sendMail'))
			.header('referrer', route('auth.forgot-password.renderForgot'))
			.json({ email: user.email })
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.forgot-password.renderForgot'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Info,
				message:
					'If the email exists in our system, we will send you an email with instructions to reset your password',
			},
		});

		mails.assertNotSent(PasswordResetRequestNotification);

		hash.restore();
	});
});
