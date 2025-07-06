import hash from '@adonisjs/core/services/hash';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import { UserFactory } from '#database/factories/user-factory';
import { giveUserPermissions } from '#test-helpers/give-user-permission';

test.group('Auth login', (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test('GET /admin without logged user redirects to login', async ({ client, route }) => {
		const response = await client.get(route('admin.dashboard.render')).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
	});

	test('GET /admin with logged user but without permission redirects to home', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		const response = await client.get(route('admin.dashboard.render')).loginAs(user).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});

	test('GET /admin with logged user and permission redirects to dashboard', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();

		giveUserPermissions(user, ['admin.dashboard.view']);

		const response = await client.get(route('admin.dashboard.render')).loginAs(user).withInertia();

		response.assertStatus(200);
		response.assertInertiaComponent('admin/dashboard');

		hash.restore();
	});
});
