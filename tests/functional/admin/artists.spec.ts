import hash from '@adonisjs/core/services/hash';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import { ParticipantFactory } from '#database/factories/participant-factory';
import { UserFactory } from '#database/factories/user-factory';
import Participant from '#models/participant';
import { giveUserPermissions } from '#test-helpers/give-user-permission';

test.group('Admin artists', (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test('GET /admin/artists without logged user redirects to login', async ({ client, route }) => {
		const response = await client.get(route('admin.artists.render')).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
	});

	test('GET /admin/artists with logged user but without permission redirects to home', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		const response = await client.get(route('admin.artists.render')).loginAs(user).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});

	test('GET /admin/artists with logged user and permission renders artists page', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.artists.view']);

		const artists = await ParticipantFactory.createMany(3);

		const response = await client.get(route('admin.artists.render')).loginAs(user).withInertia();

		response.assertStatus(200);
		response.assertInertiaComponent('admin/artists');
		response.assertInertiaPropsContains({
			artists: artists.map((artist) => ({
				id: artist.id,
				businessName: artist.businessName,
				siret: artist.siret,
				email: artist.email,
				phoneNumber: artist.phoneNumber,
				createdAt: artist.createdAt.toISO(),
				updatedAt: artist.updatedAt.toISO(),
			})),
		});

		hash.restore();
	});

	test('PUT /admin/artists with empty body returns validation errors', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.artists.create']);

		const response = await client
			.put(route('admin.artists.create'))
			.header('referrer', route('admin.artists.render'))
			.json({})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('errors', {
			businessName: ['The businessName field must be defined'],
			siret: ['The siret field must be defined'],
			email: ['The email field must be defined'],
			phoneNumber: ['The phoneNumber field must be defined'],
		});

		hash.restore();
	});

	test('PUT /admin/artists with invalid body returns validation errors', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.artists.create']);

		const response = await client
			.put(route('admin.artists.create'))
			.header('referrer', route('admin.artists.render'))
			.json({
				businessName: 'A',
				siret: '123',
				email: 'invalid-email',
				phoneNumber: '123',
			})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('errors', {
			businessName: ['The businessName field must have at least 2 characters'],
			siret: ['The siret field must have at least 14 characters'],
			email: ['The email field must be a valid email address'],
			phoneNumber: ['The phoneNumber field must have at least 10 characters'],
		});

		hash.restore();
	});

	test('PUT /admin/artists with valid body creates artist and shows success notification', async ({
		assert,
		client,
		route,
	}) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.artists.create']);

		const artistsBefore = await Participant.all();

		const response = await client
			.put(route('admin.artists.create'))
			.header('referrer', route('admin.artists.render'))
			.json({
				businessName: 'Amazing Music Band',
				siret: '12345678901234',
				email: 'contact@amazingmusic.com',
				phoneNumber: '+33123456789',
			})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('notification', {
			type: 'success',
			message: 'Artist created successfully',
		});

		const artistsAfter = await Participant.all();
		assert.equal(artistsAfter.length, artistsBefore.length + 1);

		const createdArtist = await Participant.findBy('businessName', 'Amazing Music Band');
		assert.exists(createdArtist);
		assert.equal(createdArtist!.businessName, 'Amazing Music Band');
		assert.equal(createdArtist!.siret, '12345678901234');
		assert.equal(createdArtist!.email, 'contact@amazingmusic.com');
		assert.equal(createdArtist!.phoneNumber, '+33123456789');

		hash.restore();
	});

	test('PUT /admin/artists without permission returns unauthorized', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();

		const response = await client
			.put(route('admin.artists.create'))
			.header('referrer', route('admin.artists.render'))
			.json({
				businessName: 'Amazing Music Band',
				siret: '12345678901234',
				email: 'contact@amazingmusic.com',
				phoneNumber: '+33123456789',
			})
			.loginAs(user)
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});

	test('PATCH /admin/artists/:id with valid body updates artist and shows success notification', async ({
		client,
		route,
	}) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.artists.update']);

		const artist = await ParticipantFactory.create();

		const response = await client
			.patch(route('admin.artists.update', { id: artist.id }))
			.header('referrer', route('admin.artists.render'))
			.json({
				businessName: 'Updated Band Name',
				siret: '98765432109876',
				email: 'updated@email.com',
				phoneNumber: '+33987654321',
			})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('notification', {
			type: 'success',
			message: 'Artist updated successfully',
		});

		hash.restore();
	});

	test('PATCH /admin/artists/:id with empty body returns validation errors', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.artists.update']);

		const artist = await ParticipantFactory.create();

		const response = await client
			.patch(route('admin.artists.update', { id: artist.id }))
			.header('referrer', route('admin.artists.render'))
			.json({
				businessName: '',
				siret: '',
				email: '',
				phoneNumber: '',
			})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('errors', {
			businessName: ['The businessName field must be defined'],
			siret: ['The siret field must be defined'],
			email: ['The email field must be defined'],
			phoneNumber: ['The phoneNumber field must be defined'],
		});

		hash.restore();
	});

	test('PATCH /admin/artists/:id with invalid body returns validation errors', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.artists.update']);

		const artist = await ParticipantFactory.create();

		const response = await client
			.patch(route('admin.artists.update', { id: artist.id }))
			.header('referrer', route('admin.artists.render'))
			.json({
				businessName: 'A',
				siret: 'invalid',
				email: 'not-an-email',
				phoneNumber: '123',
			})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('errors', {
			businessName: ['The businessName field must have at least 2 characters'],
			siret: ['The siret field must have at least 14 characters'],
			email: ['The email field must be a valid email address'],
			phoneNumber: ['The phoneNumber field must have at least 10 characters'],
		});

		hash.restore();
	});

	test('PATCH /admin/artists/:id with non-existent artist returns 404', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.artists.update']);

		const response = await client
			.patch(route('admin.artists.update', { id: 99_999 }))
			.header('referrer', route('admin.artists.render'))
			.json({
				businessName: 'Updated Band Name',
				siret: '98765432109876',
				email: 'updated@email.com',
				phoneNumber: '+33987654321',
			})
			.loginAs(user)
			.withCsrfToken();

		response.assertStatus(404);

		hash.restore();
	});

	test('PATCH /admin/artists/:id without permission returns unauthorized', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		const artist = await ParticipantFactory.create();

		const response = await client
			.patch(route('admin.artists.update', { id: artist.id }))
			.header('referrer', route('admin.artists.render'))
			.json({
				businessName: 'Updated Band Name',
				siret: '98765432109876',
				email: 'updated@email.com',
				phoneNumber: '+33987654321',
			})
			.loginAs(user)
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});

	test('DELETE /admin/artists/:id with valid id deletes artist and shows success notification', async ({
		assert,
		client,
		route,
	}) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.artists.delete']);

		const artist = await ParticipantFactory.create();
		const artistsBefore = await Participant.all();

		const response = await client
			.delete(route('admin.artists.delete', { id: artist.id }))
			.header('referrer', route('admin.artists.render'))
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('notification', {
			type: 'success',
			message: 'Artist deleted successfully',
		});

		const artistsAfter = await Participant.all();
		assert.equal(artistsAfter.length, artistsBefore.length - 1);

		const deletedArtist = await Participant.find(artist.id);
		assert.isNull(deletedArtist);

		hash.restore();
	});

	test('DELETE /admin/artists/:id with non-existent artist returns 404', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.artists.delete']);

		const response = await client
			.delete(route('admin.artists.delete', { id: 99_999 }))
			.header('referrer', route('admin.artists.render'))
			.loginAs(user)
			.withCsrfToken();

		response.assertStatus(404);

		hash.restore();
	});

	test('DELETE /admin/artists/:id without permission returns unauthorized', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		const artist = await ParticipantFactory.create();

		const response = await client
			.delete(route('admin.artists.delete', { id: artist.id }))
			.header('referrer', route('admin.artists.render'))
			.loginAs(user)
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});
});
