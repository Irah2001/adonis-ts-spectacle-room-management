import hash from '@adonisjs/core/services/hash';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';
import { DateTime } from 'luxon';

import { EventFactory } from '#database/factories/event-factory';
import { ParticipantFactory } from '#database/factories/participant-factory';
import { RoomFactory } from '#database/factories/room-factory';
import { UserFactory } from '#database/factories/user-factory';
import Event from '#models/event';
import { giveUserPermissions } from '#test-helpers/give-user-permission';

test.group('Admin events', (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test('GET /admin/events without logged user redirects to login', async ({ client, route }) => {
		const response = await client.get(route('admin.events.render')).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
	});

	test('GET /admin/events with logged user but without permission redirects to home', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		const response = await client.get(route('admin.events.render')).loginAs(user).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});

	test('GET /admin/events with logged user and permission renders events page', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.events.view']);

		const room = await RoomFactory.create();
		const participant = await ParticipantFactory.create();
		const events = await EventFactory.with('room', 1, (relatedRoom) => relatedRoom.merge(room))
			.with('participant', 1, (relatedParticipant) => relatedParticipant.merge(participant))
			.createMany(3);

		const response = await client.get(route('admin.events.render')).loginAs(user).withInertia();

		response.assertStatus(200);
		response.assertInertiaComponent('admin/events');
		response.assertInertiaPropsContains({
			events: events.map((event) => ({
				id: event.id,
				date: event.date.toISO(),
				status: event.status,
				seats: event.seats,
				description: event.description,
				isReady: event.isReady,
				price: event.price,
				roomId: event.roomId,
				participantId: event.participantId,
				room: {
					id: room.id,
					name: room.name,
					address: room.address,
					capacity: room.capacity,
				},
				participant: {
					id: participant.id,
					businessName: participant.businessName,
					siret: participant.siret,
					email: participant.email,
					phoneNumber: participant.phoneNumber,
				},
				createdAt: event.createdAt.toISO(),
				updatedAt: event.updatedAt.toISO(),
			})),
			rooms: [
				{
					id: room.id,
					name: room.name,
					address: room.address,
					capacity: room.capacity,
					createdAt: room.createdAt.toISO(),
					updatedAt: room.updatedAt.toISO(),
				},
			],
			participants: [
				{
					id: participant.id,
					businessName: participant.businessName,
					siret: participant.siret,
					email: participant.email,
					phoneNumber: participant.phoneNumber,
					createdAt: participant.createdAt.toISO(),
					updatedAt: participant.updatedAt.toISO(),
				},
			],
		});

		hash.restore();
	});

	test('PUT /admin/events with empty body returns validation errors', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.events.create']);

		const response = await client
			.put(route('admin.events.create'))
			.header('referrer', route('admin.events.render'))
			.json({})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('errors', {
			date: ['The date field must be defined'],
			status: ['The status field must be defined'],
			seats: ['The seats field must be defined'],
			description: ['The description field must be defined'],
			isReady: ['The isReady field must be defined'],
			price: ['The price field must be defined'],
			roomId: ['The roomId field must be defined'],
			participantId: ['The participantId field must be defined'],
		});

		hash.restore();
	});

	test('PUT /admin/events with invalid body returns validation errors', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.events.create']);

		const response = await client
			.put(route('admin.events.create'))
			.header('referrer', route('admin.events.render'))
			.json({
				date: 'invalid-date',
				status: 'planned',
				seats: -1,
				description: 'Test event',
				isReady: false,
				price: -5,
				roomId: 99_999,
				participantId: 99_999,
			})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('errors', {
			seats: ['The seats field must be at least 0'],
			price: ['The price field must be at least 0'],
			roomId: ['The selected roomId is invalid'],
			participantId: ['The selected participantId is invalid'],
		});

		hash.restore();
	});

	test('PUT /admin/events with valid body creates event and shows success notification', async ({
		assert,
		client,
		route,
	}) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.events.create']);

		const room = await RoomFactory.create();
		const participant = await ParticipantFactory.create();

		const eventsBefore = await Event.all();

		const response = await client
			.put(route('admin.events.create'))
			.header('referrer', route('admin.events.render'))
			.json({
				date: DateTime.now().plus({ days: 7 }).toISO(),
				status: 'planned',
				seats: 100,
				description: 'Amazing concert event',
				isReady: false,
				price: 50,
				roomId: room.id,
				participantId: participant.id,
			})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('notification', {
			type: 'success',
			message: 'Event created successfully',
		});

		const eventsAfter = await Event.all();
		assert.equal(eventsAfter.length, eventsBefore.length + 1);

		const createdEvent = await Event.findBy('description', 'Amazing concert event');
		assert.exists(createdEvent);
		assert.equal(createdEvent!.description, 'Amazing concert event');
		assert.equal(createdEvent!.status, 'planned');
		assert.equal(createdEvent!.seats, 100);
		assert.equal(createdEvent!.isReady, false);
		assert.equal(createdEvent!.price, 50);
		assert.equal(createdEvent!.roomId, room.id);
		assert.equal(createdEvent!.participantId, participant.id);

		hash.restore();
	});

	test('PUT /admin/events without permission returns unauthorized', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		const room = await RoomFactory.create();
		const participant = await ParticipantFactory.create();

		const response = await client
			.put(route('admin.events.create'))
			.header('referrer', route('admin.events.render'))
			.json({
				date: DateTime.now().plus({ days: 7 }).toISO(),
				status: 'planned',
				seats: 100,
				description: 'Amazing concert event',
				isReady: false,
				price: 50,
				roomId: room.id,
				participantId: participant.id,
			})
			.loginAs(user)
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});

	test('PATCH /admin/events/:id with valid body updates event and shows success notification', async ({
		client,
		route,
	}) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.events.update']);

		const room = await RoomFactory.create();
		const participant = await ParticipantFactory.create();
		const event = await EventFactory.with('room', 1, (relatedRoom) => relatedRoom.merge(room))
			.with('participant', 1, (relatedParticipant) => relatedParticipant.merge(participant))
			.create();

		const response = await client
			.patch(route('admin.events.update', { id: event.id }))
			.header('referrer', route('admin.events.render'))
			.json({
				date: DateTime.now().plus({ days: 14 }).toISO(),
				status: 'confirmed',
				seats: 200,
				description: 'Updated event description',
				isReady: true,
				price: 75,
				roomId: room.id,
				participantId: participant.id,
			})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('notification', {
			type: 'success',
			message: 'Event updated successfully',
		});

		hash.restore();
	});

	test('PATCH /admin/events/:id with empty body returns validation errors', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.events.update']);

		const event = await EventFactory.create();

		const response = await client
			.patch(route('admin.events.update', { id: event.id }))
			.header('referrer', route('admin.events.render'))
			.json({
				date: '',
				status: '',
				seats: undefined,
				description: '',
				isReady: undefined,
				price: undefined,
				roomId: undefined,
				participantId: undefined,
			})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('errors', {
			date: ['The date field must be defined'],
			status: ['The status field must be defined'],
			seats: ['The seats field must be defined'],
			description: ['The description field must be defined'],
			isReady: ['The isReady field must be defined'],
			price: ['The price field must be defined'],
			roomId: ['The roomId field must be defined'],
			participantId: ['The participantId field must be defined'],
		});

		hash.restore();
	});

	test('PATCH /admin/events/:id with invalid body returns validation errors', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.events.update']);

		const event = await EventFactory.create();

		const response = await client
			.patch(route('admin.events.update', { id: event.id }))
			.header('referrer', route('admin.events.render'))
			.json({
				date: 'invalid-date',
				status: 'planned',
				seats: -1,
				description: 'Test event',
				isReady: false,
				price: -5,
				roomId: 99_999,
				participantId: 99_999,
			})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('errors', {
			seats: ['The seats field must be at least 0'],
			price: ['The price field must be at least 0'],
			roomId: ['The selected roomId is invalid'],
			participantId: ['The selected participantId is invalid'],
		});

		hash.restore();
	});

	test('PATCH /admin/events/:id with non-existent event returns 404', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.events.update']);

		const room = await RoomFactory.create();
		const participant = await ParticipantFactory.create();

		const response = await client
			.patch(route('admin.events.update', { id: 99_999 }))
			.header('referrer', route('admin.events.render'))
			.json({
				date: DateTime.now().plus({ days: 14 }).toISO(),
				status: 'confirmed',
				seats: 200,
				description: 'Updated event description',
				isReady: true,
				price: 75,
				roomId: room.id,
				participantId: participant.id,
			})
			.loginAs(user)
			.withCsrfToken();

		response.assertStatus(404);

		hash.restore();
	});

	test('PATCH /admin/events/:id without permission returns unauthorized', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		const event = await EventFactory.create();
		const room = await RoomFactory.create();
		const participant = await ParticipantFactory.create();

		const response = await client
			.patch(route('admin.events.update', { id: event.id }))
			.header('referrer', route('admin.events.render'))
			.json({
				date: DateTime.now().plus({ days: 14 }).toISO(),
				status: 'confirmed',
				seats: 200,
				description: 'Updated event description',
				isReady: true,
				price: 75,
				roomId: room.id,
				participantId: participant.id,
			})
			.loginAs(user)
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});

	test('DELETE /admin/events/:id with valid id deletes event and shows success notification', async ({
		assert,
		client,
		route,
	}) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.events.delete']);

		const event = await EventFactory.create();
		const eventsBefore = await Event.all();

		const response = await client
			.delete(route('admin.events.delete', { id: event.id }))
			.header('referrer', route('admin.events.render'))
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('notification', {
			type: 'success',
			message: 'Event deleted successfully',
		});

		const eventsAfter = await Event.all();
		assert.equal(eventsAfter.length, eventsBefore.length - 1);

		const deletedEvent = await Event.find(event.id);
		assert.isNull(deletedEvent);

		hash.restore();
	});

	test('DELETE /admin/events/:id with non-existent event returns 404', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.events.delete']);

		const response = await client
			.delete(route('admin.events.delete', { id: 99_999 }))
			.header('referrer', route('admin.events.render'))
			.loginAs(user)
			.withCsrfToken();

		response.assertStatus(404);

		hash.restore();
	});

	test('DELETE /admin/events/:id without permission returns unauthorized', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		const event = await EventFactory.create();

		const response = await client
			.delete(route('admin.events.delete', { id: event.id }))
			.header('referrer', route('admin.events.render'))
			.loginAs(user)
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});
});
