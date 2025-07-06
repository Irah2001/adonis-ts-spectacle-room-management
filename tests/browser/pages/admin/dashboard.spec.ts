import hash from '@adonisjs/core/services/hash';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import { UserFactory } from '#database/factories/user-factory';
import { giveUserPermissions } from '#test-helpers/give-user-permission';

test.group('Admin dashboard', (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test('Dashboard page is protected and redirects to login if not authenticated', async ({ visit, route, assert }) => {
		const protectedUrl = route('admin.dashboard.render');
		const page = await visit(protectedUrl);

		await page.waitForURL(new RegExp(`${route('auth.login.render')}\\?redirectTo=`));

		const currentUrl = page.url();

		assert.include(currentUrl, `redirectTo=${encodeURIComponent(protectedUrl)}`);
	});

	test('Dashboard page redirects to homepage for user without permission', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.dashboard.render'));

		await page.assertPath(route('home'));

		hash.restore();
	});

	test('Dashboard page is accessible for user with permission', async ({ browserContext, visit, route, assert }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();

		await giveUserPermissions(user, ['admin.dashboard.view']);
		await browserContext.loginAs(user);

		const page = await visit(route('admin.dashboard.render'));

		await page.assertPath(route('admin.dashboard.render'));

		const body = await page.innerHTML('main');

		assert.snapshot(body.trim()).match();

		hash.restore();
	});
});
