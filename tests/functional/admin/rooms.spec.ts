import hash from '@adonisjs/core/services/hash';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import { RoomFactory } from '#database/factories/room-factory';
import { UserFactory } from '#database/factories/user-factory';
import Room from '#models/room';
import { giveUserPermissions } from '#test-helpers/give-user-permission';
import { NotificationType } from '#types/notification';

test.group('Admin rooms', (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test('GET /admin/rooms without logged user redirects to login', async ({ client, route }) => {
		const response = await client.get(route('admin.rooms.render')).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
	});

	test('GET /admin/rooms with logged user but without permission redirects to home', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		const response = await client.get(route('admin.rooms.render')).loginAs(user).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});

	test('GET /admin/rooms with logged user and permission renders rooms page', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.rooms.view']);

		const rooms = await RoomFactory.createMany(3);

		const response = await client.get(route('admin.rooms.render')).loginAs(user).withInertia();

		response.assertStatus(200);
		response.assertInertiaComponent('admin/rooms');
		response.assertInertiaPropsContains({
			rooms: rooms.map((room) => ({
				id: room.id,
				name: room.name,
				address: room.address,
				capacity: room.capacity,
				createdAt: room.createdAt.toISO(),
				updatedAt: room.updatedAt.toISO(),
			})),
		});

		hash.restore();
	});

	test('PUT /admin/rooms with empty body returns validation errors', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.rooms.create']);

		const response = await client
			.put(route('admin.rooms.create'))
			.header('referrer', route('admin.rooms.render'))
			.json({})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('errors', {
			name: ['The name field must be defined'],
			address: ['The address field must be defined'],
			capacity: ['The capacity field must be defined'],
		});

		hash.restore();
	});

	test('PUT /admin/rooms with invalid body returns validation errors', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.rooms.create']);

		const response = await client
			.put(route('admin.rooms.create'))
			.header('referrer', route('admin.rooms.render'))
			.json({
				name: '',
				address: '',
				capacity: 0,
			})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('errors', {
			name: ['The name field must be defined'],
			address: ['The address field must be defined'],
			capacity: ['The capacity field must be at least 1'],
		});

		hash.restore();
	});

	test('PUT /admin/rooms with valid body creates room and shows success notification', async ({
		assert,
		client,
		route,
	}) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.rooms.create']);

		const roomData = {
			name: 'Test Conference Hall',
			address: '123 Main Street, Anytown, 12345',
			capacity: 250,
		};

		const response = await client
			.put(route('admin.rooms.create'))
			.header('referrer', route('admin.rooms.render'))
			.json(roomData)
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('notification', {
			type: NotificationType.Success,
			message: 'Room created successfully',
		});

		const room = await Room.findBy('name', roomData.name);
		assert.isNotNull(room);
		assert.equal(room!.name, roomData.name);
		assert.equal(room!.address, roomData.address);
		assert.equal(room!.capacity, roomData.capacity);

		hash.restore();
	});

	test('PUT /admin/rooms without permission returns unauthorized', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();

		const response = await client
			.put(route('admin.rooms.create'))
			.header('referrer', route('admin.rooms.render'))
			.json({
				name: 'Test Room',
				address: '123 Test Street',
				capacity: 100,
			})
			.loginAs(user)
			.withCsrfToken();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});

	test('PATCH /admin/rooms/:id with valid body updates room and shows success notification', async ({
		assert,
		client,
		route,
	}) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.rooms.update']);

		const room = await RoomFactory.create();
		const updateData = {
			name: 'Updated Room Name',
			address: 'Updated Address, Updated City, 54321',
			capacity: 300,
		};

		const response = await client
			.patch(route('admin.rooms.update', { id: room.id }))
			.header('referrer', route('admin.rooms.render'))
			.json(updateData)
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('notification', {
			type: NotificationType.Success,
			message: 'Room updated successfully',
		});

		await room.refresh();
		assert.equal(room.name, updateData.name);
		assert.equal(room.address, updateData.address);
		assert.equal(room.capacity, updateData.capacity);

		hash.restore();
	});

	test('PATCH /admin/rooms/:id with empty body returns validation errors', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.rooms.update']);

		const room = await RoomFactory.create();

		const response = await client
			.patch(route('admin.rooms.update', { id: room.id }))
			.header('referrer', route('admin.rooms.render'))
			.json({})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('errors', {
			name: ['The name field must be defined'],
			address: ['The address field must be defined'],
			capacity: ['The capacity field must be defined'],
		});

		hash.restore();
	});

	test('PATCH /admin/rooms/:id with invalid body returns validation errors', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.rooms.update']);

		const room = await RoomFactory.create();

		const response = await client
			.patch(route('admin.rooms.update', { id: room.id }))
			.header('referrer', route('admin.rooms.render'))
			.json({
				name: '', // Empty name
				address: '', // Empty address
				capacity: -1, // Invalid capacity
			})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('errors', {
			name: ['The name field must be defined'],
			address: ['The address field must be defined'],
			capacity: ['The capacity field must be at least 1'],
		});

		hash.restore();
	});

	test('PATCH /admin/rooms/:id with non-existent room returns 404', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.rooms.update']);

		const nonExistentId = 99_999;
		const response = await client
			.patch(route('admin.rooms.update', { id: nonExistentId }))
			.header('referrer', route('admin.rooms.render'))
			.json({
				name: 'Updated Room',
				address: 'Updated Address',
				capacity: 200,
			})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(404);

		hash.restore();
	});

	test('PATCH /admin/rooms/:id without permission returns unauthorized', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		const room = await RoomFactory.create();

		const response = await client
			.patch(route('admin.rooms.update', { id: room.id }))
			.header('referrer', route('admin.rooms.render'))
			.json({
				name: 'Updated Room',
				address: 'Updated Address',
				capacity: 200,
			})
			.loginAs(user)
			.withCsrfToken();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});

	test('DELETE /admin/rooms/:id with valid id deletes room and shows success notification', async ({
		assert,
		client,
		route,
	}) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.rooms.delete']);

		const room = await RoomFactory.create();

		const response = await client
			.delete(route('admin.rooms.delete', { id: room.id }))
			.header('referrer', route('admin.rooms.render'))
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('notification', {
			type: NotificationType.Success,
			message: 'Room deleted successfully',
		});

		const deletedRoom = await Room.find(room.id);
		assert.isNull(deletedRoom);

		hash.restore();
	});

	test('DELETE /admin/rooms/:id with non-existent room returns 404', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.rooms.delete']);

		const nonExistentId = 99_999;
		const response = await client
			.delete(route('admin.rooms.delete', { id: nonExistentId }))
			.header('referrer', route('admin.rooms.render'))
			.loginAs(user)
			.withCsrfToken();

		response.assertStatus(404);

		hash.restore();
	});

	test('DELETE /admin/rooms/:id without permission returns unauthorized', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		const room = await RoomFactory.create();

		const response = await client
			.delete(route('admin.rooms.delete', { id: room.id }))
			.header('referrer', route('admin.rooms.render'))
			.loginAs(user)
			.withCsrfToken();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});
});
