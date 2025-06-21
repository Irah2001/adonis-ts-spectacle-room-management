import hash from '@adonisjs/core/services/hash';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import { UserFactory } from '#database/factories/user-factory';
import VerifyEmailService from '#services/verify-email-service';
import { timeTravel } from '#test-helpers/time-travel';

test.group('Auth verify email', (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test('Verify email without token page show error message and redirects to /auth/login', async ({ visit, route }) => {
		const page = await visit(route('auth.verify-email.render', { token: '' }));

		await page.waitForURL(route('auth.login.render'));
		await page.waitForSelector('.toast[data-type="error"]');

		await page.assertVisible(page.getByText('Verify email token missing'));
	});

	test('Verify email with invalid token page show error message and redirects to /auth/login', async ({
		visit,
		route,
	}) => {
		const page = await visit(route('auth.verify-email.render', { token: 'invalid-token' }));

		await page.waitForURL(route('auth.login.render'));
		await page.waitForSelector('.toast[data-type="error"]');

		await page.assertVisible(page.getByText('Invalid or expired verify email token'));
	});

	test('Verify email with expired token page show error message and redirects to /auth/login', async ({
		visit,
		route,
	}) => {
		hash.fake();

		const verifyEmailService = new VerifyEmailService();
		const user = await UserFactory.create();
		const token = await verifyEmailService.generateToken(user);

		timeTravel('1d');

		const page = await visit(route('auth.verify-email.render', { token }));

		await page.waitForURL(route('auth.login.render'));
		await page.waitForSelector('.toast[data-type="error"]');

		await page.assertVisible(page.getByText('Invalid or expired verify email token'));

		hash.restore();
	});

	test('Verify email with old token page show error message and redirects to /auth/login', async ({ visit, route }) => {
		hash.fake();

		const verifyEmailService = new VerifyEmailService();
		const user = await UserFactory.create();
		const token = await verifyEmailService.generateToken(user);

		await verifyEmailService.generateToken(user);

		const page = await visit(route('auth.verify-email.render', { token }));

		await page.waitForURL(route('auth.login.render'));
		await page.waitForSelector('.toast[data-type="error"]');

		await page.assertVisible(page.getByText('Invalid or expired verify email token'));

		hash.restore();
	});

	test('Verify email with used token page show error message and redirects to /auth/login', async ({
		client,
		visit,
		route,
	}) => {
		hash.fake();

		const verifyEmailService = new VerifyEmailService();
		const user = await UserFactory.create();
		const token = await verifyEmailService.generateToken(user);

		await client.post(route('auth.verify-email.render', { token })).withCsrfToken().withInertia();

		const page = await visit(route('auth.verify-email.render', { token }));

		await page.waitForURL(route('auth.login.render'));
		await page.waitForSelector('.toast[data-type="error"]');

		await page.assertVisible(page.getByText('Invalid or expired verify email token'));

		hash.restore();
	});

	test('Verify email with valid token page show verify email form', async ({ assert, visit, route }) => {
		hash.fake();

		const verifyEmailService = new VerifyEmailService();
		const user = await UserFactory.create();
		const token = await verifyEmailService.generateToken(user);
		const page = await visit(route('auth.verify-email.render', { token }));

		await page.assertPath(route('auth.verify-email.render', { token }));

		const body = await page.innerHTML('main');

		assert.snapshot(body.trim()).match();

		hash.restore();
	});

	test('Show confirmation message when clicking verify button', async ({ visit, route }) => {
		hash.fake();

		const verifyEmailService = new VerifyEmailService();
		const user = await UserFactory.create();
		const token = await verifyEmailService.generateToken(user);
		const page = await visit(route('auth.verify-email.render', { token }));

		await page.getByRole('button', { name: 'Verify Email' }).click();
		await page.waitForURL(route('auth.login.render'));
		await page.waitForSelector('.toast[data-type="success"]');

		await page.assertVisible(page.getByText('Your email has been successfully verified'));

		hash.restore();
	});
});
