import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

test.group('Auth forgot password', (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test('Forgot password page show forgot password form', async ({ assert, visit, route }) => {
		const page = await visit(route('auth.forgot-password.renderForgot'));

		await page.assertPath(route('auth.forgot-password.renderForgot'));

		const body = await page.innerHTML('main');

		assert.snapshot(body.trim()).match();
	});

	test('Submit button is not activated when the form is invalid', async ({ visit, route }) => {
		const page = await visit(route('auth.forgot-password.renderForgot'));
		const submitButton = page.getByRole('button', { name: 'Reset Password' });

		await page.assertDisabled(submitButton);

		await page.getByLabel('Email').fill('not-an-email');
		await page.assertDisabled(submitButton);
	});

	test('Submit button is activated when the form is valid', async ({ visit, route }) => {
		const page = await visit(route('auth.forgot-password.renderForgot'));
		const submitButton = page.getByRole('button', { name: 'Reset Password' });

		await page.assertDisabled(submitButton);

		await page.getByLabel('Email').fill('test@test.fr');
		await page.assertNotDisabled(submitButton);
	});

	test('Show error message when form field is invalid', async ({ visit, route }) => {
		const page = await visit(route('auth.forgot-password.renderForgot'));

		await page.getByLabel('Email').fill('not-an-email');
		await page.assertVisible(page.getByText('The email field must be a valid email address'));
	});

	test('Remove error message when form field is valid', async ({ visit, route }) => {
		const page = await visit(route('auth.forgot-password.renderForgot'));

		await page.getByLabel('Email').fill('not-an-email');
		await page.getByLabel('Email').fill('test@test.fr');
		await page.assertNotVisible(page.getByText('The email field must be a valid email address'));
	});

	test('Show email information message when form is submitted with non-existent email', async ({ visit, route }) => {
		const page = await visit(route('auth.forgot-password.renderForgot'));

		await page.getByLabel('Email').fill('test@test.fr');
		await page.getByRole('button', { name: 'Reset Password' }).click();
		await page.waitForSelector('.toast[data-type="info"]');

		await page.assertVisible(
			page.getByText(
				'If the email exists in our system, we will send you an email with instructions to reset your password',
			),
		);
	});

	test('Show email information message when form is submitted with existing email', async ({ visit, route }) => {
		const page = await visit(route('auth.forgot-password.renderForgot'));

		await page.getByLabel('Email').fill('test@test.fr');
		await page.getByRole('button', { name: 'Reset Password' }).click();
		await page.waitForSelector('.toast[data-type="info"]');

		await page.assertVisible(
			page.getByText(
				'If the email exists in our system, we will send you an email with instructions to reset your password',
			),
		);
	});
});
