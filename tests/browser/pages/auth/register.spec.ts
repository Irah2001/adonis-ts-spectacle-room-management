import hash from '@adonisjs/core/services/hash';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import { UserFactory } from '#database/factories/user-factory';

test.group('Auth register', (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test('Register page show register form', async ({ assert, visit, route }) => {
		const page = await visit(route('auth.register.render'));

		await page.assertPath(route('auth.register.render'));

		const body = await page.innerHTML('main');

		assert.snapshot(body.trim()).match();
	});

	test('Submit button is not activated when the form is invalid', async ({ visit, route }) => {
		const page = await visit(route('auth.register.render'));
		const submitButton = page.getByRole('button', { name: 'Create an account' });

		await page.assertDisabled(submitButton);

		await page.getByLabel('Email').fill('not-an-email');
		await page.getByLabel('Password', { exact: true }).fill('password');
		await page.getByLabel('Confirm password').fill('not-the-same-password');

		await page.assertDisabled(submitButton);
	});

	test('Submit button is activated when the form is valid', async ({ visit, route }) => {
		const page = await visit(route('auth.register.render'));
		const submitButton = page.getByRole('button', { name: 'Create an account' });

		await page.assertDisabled(submitButton);

		await page.getByLabel('Email').fill('test@test.fr');
		await page.getByLabel('Password', { exact: true }).fill('Test123!');
		await page.getByLabel('Confirm password').fill('Test123!');

		await page.assertNotDisabled(submitButton);
	});

	test('Show error message when form field is invalid', async ({ visit, route }) => {
		const page = await visit(route('auth.register.render'));

		await page.getByLabel('Email').fill('not-an-email');
		await page.assertVisible(page.getByText('The email field must be a valid email address'));

		await page.getByLabel('Password', { exact: true }).fill('password');
		await page.assertVisible(page.getByText('The password field format is invalid'));

		await page.getByLabel('Confirm password').fill('not-the-same-password');
		await page.assertVisible(page.getByText('The passwordConfirmation field and password field must be the same'));
	});

	test('Remove error message when form field is valid', async ({ visit, route }) => {
		const page = await visit(route('auth.register.render'));

		await page.getByLabel('Email').fill('not-an-email');
		await page.getByLabel('Email').fill('test@test.fr');
		await page.assertNotVisible(page.getByText('The email field must be a valid email address'));
	});

	test('Show error message when submitting form with existing email', async ({ visit, route }) => {
		hash.fake();

		const alreadyRegisteredUser = await UserFactory.apply('test', 'verified').create();
		const page = await visit(route('auth.register.render'));

		await page.getByLabel('Email').fill(alreadyRegisteredUser.email);
		await page.getByLabel('Password', { exact: true }).fill('Test123!');
		await page.getByLabel('Confirm password').fill('Test123!');
		await page.getByRole('button', { name: 'Create an account' }).click();
		await page.waitForSelector('.toast[data-type="error"]');

		await page.assertVisible(page.getByText('The email has already been taken'));
		await page.assertVisible(page.getByText('An error has occurred, please try again'));

		hash.restore();
	});

	test('Show verify email notification when submitting the form', async ({ visit, route }) => {
		hash.fake();

		const page = await visit(route('auth.register.render'));

		await page.getByLabel('Email').fill('test@test.fr');
		await page.getByLabel('Password', { exact: true }).fill('Test123!');
		await page.getByLabel('Confirm password').fill('Test123!');
		await page.getByRole('button', { name: 'Create an account' }).click();
		await page.waitForURL(route('auth.login.render'));
		await page.waitForSelector('.toast[data-type="info"]');

		await page.assertVisible(page.getByText('Please check your emails to verify your account'));
		await page.assertVisible(page.getByRole('button', { name: 'Resend email' }));

		hash.restore();
	});

	test('Home page show register button when not logged in', async ({ visit, route }) => {
		const page = await visit(route('home'));
		const registerLink = page.getByRole('link', { name: 'Register' });

		await page.assertExists(registerLink);

		await registerLink.click();
		await page.waitForURL(route('auth.register.render'));

		await page.assertUrlContains(route('auth.register.render'));
	});
});
