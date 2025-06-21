import app from '@adonisjs/core/services/app';
import hash from '@adonisjs/core/services/hash';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import { UserFactory } from '#database/factories/user-factory';
import Token from '#models/token';
import User from '#models/user';
import PasswordResetService from '#services/password-reset-service';
import MockPasswordResetService from '#test-helpers/mocks/mock-password-reset-service';
import { timeTravel } from '#test-helpers/time-travel';
import { NotificationType } from '#types/notification';

test.group('Auth password reset', (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test('GET /auth/password-reset/:token with logged user redirects to home', async ({ client, route }) => {
		hash.fake();

		const passwordResetService = new PasswordResetService();
		const user = await UserFactory.create();
		const token = await passwordResetService.generateToken(user);
		const response = await client.get(route('auth.password-reset.renderReset', { token })).loginAs(user).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});

	test('GET /auth/password-reset/:token without token shows error notification and redirects to /auth/forgot-password', async ({
		client,
		route,
	}) => {
		const response = await client.get(route('auth.password-reset.renderReset', { token: '' })).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.forgot-password.renderForgot'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'Password reset token missing',
			},
		});
	});

	test('GET /auth/password-reset/:token with invalid token shows error notification and redirects to /auth/forgot-password', async ({
		client,
		route,
		assert,
		expect,
	}) => {
		const mockPasswordResetService = new MockPasswordResetService();

		app.container.swap(PasswordResetService, () => {
			return mockPasswordResetService;
		});

		const response = await client
			.get(route('auth.password-reset.renderReset', { token: 'invalid-token' }))
			.withInertia();

		expect(mockPasswordResetService.verifyToken).toHaveBeenCalledTimes(1);
		expect(mockPasswordResetService.verifyToken).toHaveBeenCalledWith('invalid-token');

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.forgot-password.renderForgot'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'Invalid or expired password reset token',
			},
		});

		assert.isFalse(await mockPasswordResetService.verifyToken('invalid-token'));

		app.container.restore(PasswordResetService);
	});

	test('GET /auth/password-reset/:token with expired token shows error notification and redirects to /auth/forgot-password', async ({
		client,
		route,
	}) => {
		hash.fake();

		const passwordResetService = new PasswordResetService();
		const user = await UserFactory.create();
		const token = await passwordResetService.generateToken(user);

		timeTravel('1h');

		const response = await client.get(route('auth.password-reset.renderReset', { token })).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.forgot-password.renderForgot'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'Invalid or expired password reset token',
			},
		});
	});

	test('GET /auth/password-reset/:token with valid token renders auth/password-reset view', async ({
		client,
		route,
	}) => {
		hash.fake();

		const passwordResetService = new PasswordResetService();
		const user = await UserFactory.create();
		const token = await passwordResetService.generateToken(user);
		const response = await client.get(route('auth.password-reset.renderReset', { token })).withInertia();

		response.assertStatus(200);
		response.assertInertiaComponent('auth/password-reset');
		response.assertInertiaProps({ token });

		hash.restore();
	});

	test('PATCH /auth/password-reset/:token with invalid token shows error notification and redirects to /auth/forgot-password', async ({
		client,
		route,
		expect,
		assert,
	}) => {
		const mockPasswordResetService = new MockPasswordResetService();

		app.container.swap(PasswordResetService, () => {
			return mockPasswordResetService;
		});

		const response = await client
			.patch(route('auth.password-reset.update', { token: 'test' }))
			.header('referrer', route('auth.password-reset.renderReset', { token: 'test' }))
			.json({})
			.withCsrfToken()
			.withInertia();

		expect(mockPasswordResetService.getUserByToken).toHaveBeenCalledTimes(1);
		expect(mockPasswordResetService.getUserByToken).toHaveBeenCalledWith('test');

		assert.notExists(await mockPasswordResetService.getUserByToken('test'));

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.forgot-password.renderForgot'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'Invalid/expired password reset token or user not found',
			},
		});

		app.container.restore(PasswordResetService);
	});

	test('PATCH /auth/password-reset/:token with expired token shows error notification and redirects to /auth/forgot-password', async ({
		assert,
		client,
		route,
	}) => {
		hash.fake();

		const passwordResetService = new PasswordResetService();
		const user = await UserFactory.create();
		const token = await passwordResetService.generateToken(user);

		timeTravel('1h');

		const response = await client
			.patch(route('auth.password-reset.update', { token }))
			.header('referrer', route('auth.password-reset.renderReset', { token }))
			.json({})
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.forgot-password.renderForgot'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'Invalid/expired password reset token or user not found',
			},
		});

		const updatedUser = await User.findOrFail(user.id);

		assert.equal(updatedUser.password, user.password);

		hash.restore();
	});

	test('PATCH /auth/password-reset/:token with valid token and empty body shows validation errors', async ({
		client,
		route,
		assert,
	}) => {
		hash.fake();

		const passwordResetService = new PasswordResetService();
		const user = await UserFactory.create();
		const token = await passwordResetService.generateToken(user);
		const response = await client
			.patch(route('auth.password-reset.update', { token }))
			.header('referrer', route('auth.password-reset.renderReset', { token }))
			.json({})
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.password-reset.renderReset', { token }));
		response.assertInertiaPropsContains({
			errors: {
				password: 'The password field must be defined',
				passwordConfirmation: 'The passwordConfirmation field must be defined',
			},
		});

		const updatedUser = await User.findOrFail(user.id);

		assert.equal(updatedUser.password, user.password);

		hash.restore();
	});

	test('PATCH /auth/password-reset/:token with valid token and invalid body shows validation errors', async ({
		client,
		route,
		assert,
	}) => {
		hash.fake();

		const passwordResetService = new PasswordResetService();
		const user = await UserFactory.create();
		const token = await passwordResetService.generateToken(user);
		const response = await client
			.patch(route('auth.password-reset.update', { token }))
			.header('referrer', route('auth.password-reset.renderReset', { token }))
			.json({ password: 'password', passwordConfirmation: 'not-the-same-password' })
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.password-reset.renderReset', { token }));
		response.assertInertiaPropsContains({
			errors: {
				password: 'The password field format is invalid',
				passwordConfirmation: 'The passwordConfirmation field and password field must be the same',
			},
		});

		const updatedUser = await User.findOrFail(user.id);

		assert.equal(updatedUser.password, user.password);

		hash.restore();
	});

	test('PATCH /auth/password-reset/:token with valid token and valid body resets password', async ({
		client,
		route,
		assert,
		expect,
	}) => {
		hash.fake();

		const mockPasswordResetService = new MockPasswordResetService();

		app.container.swap(PasswordResetService, () => {
			return mockPasswordResetService;
		});

		const passwordResetService = new PasswordResetService();
		const user = await UserFactory.create();
		const stringToken = await passwordResetService.generateToken(user);
		const response = await client
			.patch(route('auth.password-reset.update', { token: stringToken }))
			.json({ password: 'Test123!', passwordConfirmation: 'Test123!' })
			.withCsrfToken()
			.withInertia();

		expect(mockPasswordResetService.clearPreviousToken).toHaveBeenCalledTimes(1);

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Success,
				message: 'Your password has been successfully reset',
			},
		});

		const updatedUser = await User.findOrFail(user.id);

		assert.notEqual(updatedUser.password, user.password);
		assert.isTrue(await hash.verify(updatedUser.password, 'Test123!'));

		const token = await Token.findBy('token', stringToken);
		const userTokens = await updatedUser.related('tokens').query();
		const userPasswordResetToken = await updatedUser.related('passwordResetToken').query().first();

		assert.notExists(token);
		assert.empty(userTokens);
		assert.notExists(userPasswordResetToken);

		app.container.restore(PasswordResetService);
		hash.restore();
	});

	test('GET /auth/password-reset/:token with used token shows error notification and redirects to /auth/forgot-password', async ({
		client,
		route,
	}) => {
		hash.fake();

		const passwordResetService = new PasswordResetService();
		const user = await UserFactory.create();
		const token = await passwordResetService.generateToken(user);

		await client
			.patch(route('auth.password-reset.update', { token }))
			.json({ password: 'Test123!', passwordConfirmation: 'Test123!' })
			.withCsrfToken()
			.withInertia();

		const response = await client.get(route('auth.password-reset.renderReset', { token })).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.forgot-password.renderForgot'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'Invalid or expired password reset token',
			},
		});
	});

	test('GET /auth/password-reset/:token with old token shows error notification and redirects to /auth/forgot-password', async ({
		client,
		route,
		assert,
	}) => {
		hash.fake();

		const passwordResetService = new PasswordResetService();
		const user = await UserFactory.create();
		const stringToken = await passwordResetService.generateToken(user);

		await passwordResetService.generateToken(user);

		const response = await client.get(route('auth.password-reset.renderReset', { token: stringToken })).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.forgot-password.renderForgot'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'Invalid or expired password reset token',
			},
		});

		const updatedUser = await User.findOrFail(user.id);
		const token = await Token.findBy('token', stringToken);
		const userTokens = await updatedUser.related('tokens').query();
		const userPasswordResetToken = await updatedUser.related('passwordResetToken').query().firstOrFail();

		assert.notExists(token);
		assert.notEmpty(userTokens);
		assert.notEqual(userTokens[0].token, stringToken);
		assert.notEqual(userPasswordResetToken.token, stringToken);
	});

	test('PATCH /auth/password-reset/:token with used token shows error notification and redirects to /auth/forgot-password', async ({
		client,
		route,
		assert,
	}) => {
		hash.fake();

		const passwordResetService = new PasswordResetService();
		const user = await UserFactory.create();
		const stringToken = await passwordResetService.generateToken(user);

		await client
			.patch(route('auth.password-reset.update', { token: stringToken }))
			.json({ password: 'Test123!', passwordConfirmation: 'Test123!' })
			.withCsrfToken()
			.withInertia();

		const response = await client
			.patch(route('auth.password-reset.update', { token: stringToken }))
			.header('referrer', route('auth.password-reset.renderReset', { token: stringToken }))
			.json({ password: 'Test456!', passwordConfirmation: 'Test456!' })
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.forgot-password.renderForgot'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'Invalid/expired password reset token or user not found',
			},
		});

		const updatedUser = await User.findOrFail(user.id);

		assert.isFalse(await hash.verify(updatedUser.password, 'Test456!'));

		const token = await Token.findBy('token', stringToken);
		const userTokens = await updatedUser.related('tokens').query();
		const userPasswordResetToken = await updatedUser.related('passwordResetToken').query().first();

		assert.notExists(token);
		assert.empty(userTokens);
		assert.notExists(userPasswordResetToken);

		hash.restore();
	});

	test('PATCH /auth/password-reset/:token with old token shows error notification and redirects to /auth/forgot-password', async ({
		client,
		route,
		assert,
	}) => {
		hash.fake();

		const passwordResetService = new PasswordResetService();
		const user = await UserFactory.create();
		const token = await passwordResetService.generateToken(user);

		await passwordResetService.generateToken(user);

		const response = await client
			.patch(route('auth.password-reset.update', { token }))
			.header('referrer', route('auth.password-reset.renderReset', { token }))
			.json({ password: 'Test456!', passwordConfirmation: 'Test456!' })
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.forgot-password.renderForgot'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Error,
				message: 'Invalid/expired password reset token or user not found',
			},
		});

		const updatedUser = await User.findOrFail(user.id);

		assert.isFalse(await hash.verify(updatedUser.password, 'Test456!'));

		hash.restore();
	});
});
