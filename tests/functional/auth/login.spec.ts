import hash from '@adonisjs/core/services/hash';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import { UserFactory } from '#database/factories/user-factory';
import { NotificationType } from '#types/notification';

test.group('Auth login', (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test('GET /auth/login renders auth/login view', async ({ client, route }) => {
		const response = await client.get(route('auth.login.render')).withInertia();

		response.assertStatus(200);
		response.assertInertiaComponent('auth/login');
		response.assertInertiaProps({});
	});

	test('GET /auth/login with logged user redirects to home', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		const response = await client.get(route('auth.login.render')).loginAs(user).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});

	test('GET / with logged user has user as prop', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		const serializedUser = user.serialize({ fields: ['email'] });
		const response = await client.get(route('home')).loginAs(user).withInertia();

		response.assertStatus(200);
		response.assertInertiaPropsContains({
			user: serializedUser,
		});

		hash.restore();
	});

	test('POST /auth/login with empty body returns validation errors', async ({ client, route }) => {
		const response = await client
			.post(route('auth.login.handle'))
			.header('referrer', route('auth.login.render'))
			.json({})
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
		response.assertInertiaProps({
			errors: {
				email: 'The email field must be defined',
				password: 'The password field must be defined',
			},
		});
	});

	test('POST /auth/login with invalid body returns validation errors', async ({ client, route }) => {
		const response = await client
			.post(route('auth.login.handle'))
			.header('referrer', route('auth.login.render'))
			.json({
				email: 'not-an-email',
				password: '',
			})
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
		response.assertInertiaProps({
			errors: {
				email: 'The email field must be a valid email address',
				password: 'The password field must be defined',
			},
		});
	});

	test('POST /auth/login with invalid credentials returns error notification', async ({ client, route }) => {
		const response = await client
			.post(route('auth.login.handle'))
			.header('referrer', route('auth.login.render'))
			.json({
				email: 'test@test.fr',
				password: 'Test123!',
			})
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
		response.assertInertiaPropsContains({
			errors: {
				E_INVALID_CREDENTIALS: 'Invalid user credentials',
			},
		});
	});

	test('POST /auth/login with deleted account returns error notification', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.apply('test', 'deleted').make();
		const response = await client
			.post(route('auth.login.handle'))
			.header('referrer', route('auth.login.render'))
			.json({
				email: user.email,
				password: 'Test123!',
			})
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
		response.assertInertiaPropsContains({
			errors: {
				E_INVALID_CREDENTIALS: 'Invalid user credentials',
			},
		});
		hash.restore();
	});

	test('POST /auth/login with valid credentials and unverified user returns verify email notification', async ({
		client,
		route,
	}) => {
		hash.fake();

		const user = await UserFactory.apply('test').create();
		const response = await client
			.post(route('auth.login.handle'))
			.header('referrer', route('auth.login.render'))
			.json({
				email: user.email,
				password: 'Test123!',
			})
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
		response.assertInertiaProps({
			notification: {
				type: NotificationType.Info,
				message: 'Please check your emails to verify your account',
				actionLabel: 'Resend email',
				actionUrl: route('auth.verify-email.resend'),
				actionMethod: 'post',
				actionBody: {
					email: user.email,
				},
			},
		});

		hash.restore();
	});

	test('POST /auth/login with valid credentials and verified user logs user in', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.apply('test', 'verified').create();
		const response = await client
			.post(route('auth.login.handle'))
			.json({
				email: user.email,
				password: 'Test123!',
			})
			.redirects(0)
			.withCsrfToken();

		response.assertStatus(302);
		response.assertFlashMessage('notification', {
			type: NotificationType.Success,
			message: 'You have been logged in successfully',
		});

		const redirectionResponse = await client
			.post(route('auth.login.handle'))
			.json({
				email: user.email,
				password: 'Test123!',
			})
			.withCsrfToken()
			.withInertia();

		redirectionResponse.assertStatus(200);
		redirectionResponse.assertRedirectsTo(route('home'));

		hash.restore();
	});
});
