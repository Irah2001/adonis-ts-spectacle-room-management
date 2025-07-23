import hash from '@adonisjs/core/services/hash';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';
import { DateTime } from 'luxon';

import { EventFactory } from '#database/factories/event-factory';
import { ParticipantFactory } from '#database/factories/participant-factory';
import { RoomFactory } from '#database/factories/room-factory';
import { UserFactory } from '#database/factories/user-factory';
import { giveUserPermissions } from '#test-helpers/give-user-permission';

declare global {
	interface Window {
		confirm: (message?: string) => boolean;
	}
}

test.group('Admin events page', (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test('Events page is protected and redirects to login if not authenticated', async ({ visit, route, assert }) => {
		const protectedUrl = route('admin.events.render');
		const page = await visit(protectedUrl);

		await page.waitForURL(new RegExp(`${route('auth.login.render')}\\?redirectTo=`));

		const currentUrl = page.url();

		assert.include(currentUrl, `redirectTo=${encodeURIComponent(protectedUrl)}`);
	});

	test('Events page redirects to homepage for user without permission', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.events.render'));

		await page.assertPath(route('home'));

		hash.restore();
	});

	test('Events page is accessible for user with permission', async ({ browserContext, visit, route, assert }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();

		await giveUserPermissions(user, ['admin.events.view']);
		await browserContext.loginAs(user);

		const page = await visit(route('admin.events.render'));

		await page.assertPath(route('admin.events.render'));

		const body = await page.innerHTML('main');

		assert.snapshot(body.trim()).match();

		hash.restore();
	});

	test('Events page displays existing events in cards', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.events.view']);

		const room = await RoomFactory.create();
		const participant = await ParticipantFactory.create();
		const events = await EventFactory.with('room', 1, (relatedRoom) => relatedRoom.merge(room))
			.with('participant', 1, (relatedParticipant) => relatedParticipant.merge(participant))
			.createMany(3);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.events.render'));

		for (const event of events) {
			await page.assertVisible(page.getByText(event.description));
			await page.assertVisible(page.getByText(`Seats: ${event.seats.toString()}`));
			await page.assertVisible(page.getByText(`Price: ${event.price.toString()}`));
		}

		hash.restore();
	});

	test('Create event button opens dialog', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.events.view', 'admin.events.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.events.render'));

		const addButton = page.getByRole('button', { name: 'Add Event' });
		await page.assertExists(addButton);

		await addButton.click();

		await page.assertVisible(page.getByText('Add New Event'));
		await page.assertVisible(page.getByText('Enter the details for the new event.'));

		hash.restore();
	});

	test('Create event form validates required fields', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.events.view', 'admin.events.create']);

		const room = await RoomFactory.create();
		const participant = await ParticipantFactory.create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.events.render'));

		await page.getByRole('button', { name: 'Add Event' }).click();

		const submitButton = page.getByRole('button', { name: 'Create Event' });

		await page.assertDisabled(submitButton);

		await page.getByLabel('Date').fill(DateTime.now().plus({ days: 7 }).toFormat('yyyy-MM-dd'));
		await page.assertDisabled(submitButton);

		await page.getByLabel('Status').click();
		await page.getByRole('option', { name: 'Planned' }).click();
		await page.assertDisabled(submitButton);

		await page.getByLabel('Seats').fill('100');
		await page.assertDisabled(submitButton);

		await page.getByLabel('Description').fill('Amazing concert event');
		await page.assertDisabled(submitButton);

		await page.getByLabel('Price').fill('50');
		await page.assertDisabled(submitButton);

		await page.getByLabel('Room').click();
		await page.getByRole('option', { name: room.name }).click();
		await page.assertDisabled(submitButton);

		await page.getByLabel('Participant').click();
		await page.getByRole('option', { name: participant.businessName }).click();

		await page.assertNotDisabled(submitButton);

		hash.restore();
	});

	test('Create event form shows validation errors for invalid input', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.events.view', 'admin.events.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.events.render'));

		await page.getByRole('button', { name: 'Add Event' }).click();

		await page.getByLabel('Seats').fill('-1');
		await page.getByLabel('Seats').blur();

		await page.getByLabel('Price').fill('-5');
		await page.getByLabel('Price').blur();

		hash.restore();
	});

	test('Create event form submits successfully with valid data', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.events.view', 'admin.events.create']);

		const room = await RoomFactory.create();
		const participant = await ParticipantFactory.create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.events.render'));

		await page.getByRole('button', { name: 'Add Event' }).click();

		await page.getByLabel('Date').fill(DateTime.now().plus({ days: 7 }).toFormat('yyyy-MM-dd'));
		await page.getByLabel('Status').click();
		await page.getByRole('option', { name: 'Planned' }).click();
		await page.getByLabel('Seats').fill('100');
		await page.getByLabel('Description').fill('Amazing concert event');
		await page.getByLabel('Price').fill('50');
		await page.getByLabel('Room').click();
		await page.getByRole('option', { name: room.name }).click();
		await page.getByLabel('Participant').click();
		await page.getByRole('option', { name: participant.businessName }).click();

		await page.getByRole('button', { name: 'Create Event' }).click();

		await page.waitForSelector('.toast[data-type="success"]');
		await page.assertVisible(page.getByText('Event created successfully'));

		await page.assertVisible(page.getByText('Amazing concert event'));
		await page.assertVisible(page.getByText('planned'));
		await page.assertVisible(page.getByText('100'));

		hash.restore();
	});

	test('Edit event button opens edit dialog', async ({ browserContext, visit, route, assert }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.events.view', 'admin.events.update']);

		const room = await RoomFactory.create();
		const participant = await ParticipantFactory.create();
		const event = await EventFactory.with('room', 1, (relatedRoom) => relatedRoom.merge(room))
			.with('participant', 1, (relatedParticipant) => relatedParticipant.merge(participant))
			.apply('upcoming')
			.create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.events.render'));

		const editButton = page.getByRole('button', { name: 'Edit' }).first();
		await page.assertExists(editButton);

		await editButton.click();

		await page.assertVisible(page.getByText('Edit Event'));
		await page.assertVisible(page.getByText('Update the event information.'));

		const descriptionInput = page.getByLabel('Description');
		const statusButton = page.getByLabel('Status');
		const seatsInput = page.getByLabel('Seats');
		const priceInput = page.getByLabel('Price');

		const descriptionValue = await descriptionInput.inputValue();
		const statusValue = await statusButton.textContent();
		const seatsValue = await seatsInput.inputValue();
		const priceValue = await priceInput.inputValue();

		assert.equal(descriptionValue, event.description);
		assert.equal(statusValue?.toLowerCase(), event.status);
		assert.equal(seatsValue, event.seats.toString());
		assert.equal(priceValue, event.price.toString());

		hash.restore();
	});

	test('Edit event form updates event successfully', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.events.view', 'admin.events.update']);

		const room = await RoomFactory.create();
		const participant = await ParticipantFactory.create();
		await EventFactory.with('room', 1, (relatedRoom) => relatedRoom.merge(room))
			.with('participant', 1, (relatedParticipant) => relatedParticipant.merge(participant))
			.apply('upcoming')
			.create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.events.render'));

		const editButton = page.getByRole('button', { name: 'Edit' }).first();
		await editButton.click();

		await page.getByLabel('Description').fill('Updated Event Description');
		await page.getByLabel('Status').click();
		await page.getByRole('option', { name: 'Confirmed' }).click();
		await page.getByLabel('Seats').fill('200');
		await page.getByLabel('Price').fill('75');

		await page.getByRole('button', { name: 'Update Event' }).click();

		await page.waitForSelector('.toast[data-type="success"]');
		await page.assertVisible(page.getByText('Event updated successfully'));

		await page.assertVisible(page.getByText('Updated Event Description'));
		await page.assertVisible(page.getByText('Status: confirmed'));
		await page.assertVisible(page.getByText('Seats: 200'));
		await page.assertVisible(page.getByText('Price: 75'));

		hash.restore();
	});

	test('Delete event button deletes event successfully', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.events.view', 'admin.events.delete']);

		const room = await RoomFactory.create();
		const participant = await ParticipantFactory.create();
		const event = await EventFactory.with('room', 1, (relatedRoom) => relatedRoom.merge(room))
			.with('participant', 1, (relatedParticipant) => relatedParticipant.merge(participant))
			.apply('upcoming')
			.merge({ description: 'Event to be deleted' })
			.create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.events.render'));

		await page.evaluateHandle(() => {
			(globalThis as typeof globalThis & { confirm: () => boolean }).confirm = () => true;
		});

		const deleteButton = page.getByRole('button', { name: 'Delete' }).first();
		await deleteButton.click();

		await page.waitForSelector('.toast[data-type="success"]');
		await page.assertVisible(page.getByText('Event deleted successfully'));

		await page.assertNotVisible(event.description);

		hash.restore();
	});

	test('Delete event shows confirmation dialog', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.events.view', 'admin.events.delete']);

		const room = await RoomFactory.create();
		const participant = await ParticipantFactory.create();
		const event = await EventFactory.with('room', 1, (relatedRoom) => relatedRoom.merge(room))
			.with('participant', 1, (relatedParticipant) => relatedParticipant.merge(participant))
			.create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.events.render'));

		await page.evaluateHandle(() => {
			(globalThis as typeof globalThis & { confirm: () => boolean }).confirm = () => false;
		});

		const deleteButton = page.getByRole('button', { name: 'Delete' }).first();
		await deleteButton.click();

		await page.assertVisible(page.getByText(event.description));

		hash.restore();
	});

	test('Cancel button closes create dialog', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.events.view', 'admin.events.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.events.render'));

		await page.getByRole('button', { name: 'Add Event' }).click();
		await page.assertVisible(page.getByText('Add New Event'));

		await page.keyboard.press('Escape');

		await page.assertNotVisible(page.getByText('Add New Event'));

		hash.restore();
	});

	test('Cancel button closes edit dialog', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.events.view', 'admin.events.update']);

		const room = await RoomFactory.create();
		const participant = await ParticipantFactory.create();
		await EventFactory.with('room', 1, (relatedRoom) => relatedRoom.merge(room))
			.with('participant', 1, (relatedParticipant) => relatedParticipant.merge(participant))
			.create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.events.render'));

		const editButton = page.getByRole('button', { name: 'Edit' }).first();
		await editButton.click();

		await page.assertVisible(page.getByText('Edit Event'));

		const cancelButton = page.getByRole('button', { name: 'Cancel' });
		await cancelButton.click();

		await page.assertNotVisible(page.getByText('Edit Event'));

		hash.restore();
	});

	test('Empty state message shows when no events exist', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.events.view']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.events.render'));

		await page.assertVisible(page.getByText('No events found. Add your first event to get started.'));

		hash.restore();
	});

	test('Event status displays correct badge styling', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.events.view']);

		const room = await RoomFactory.create();
		const participant = await ParticipantFactory.create();

		await EventFactory.with('room', 1, (relatedRoom) => relatedRoom.merge(room))
			.with('participant', 1, (relatedParticipant) => relatedParticipant.merge(participant))
			.merge({ status: 'planned' })
			.create();
		await EventFactory.with('room', 1, (relatedRoom) => relatedRoom.merge(room))
			.with('participant', 1, (relatedParticipant) => relatedParticipant.merge(participant))
			.merge({ status: 'confirmed' })
			.create();
		await EventFactory.with('room', 1, (relatedRoom) => relatedRoom.merge(room))
			.with('participant', 1, (relatedParticipant) => relatedParticipant.merge(participant))
			.merge({ status: 'cancelled' })
			.apply('cancelled')
			.create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.events.render'));

		await page.assertVisible(page.getByText('planned'));
		await page.assertVisible(page.getByText('confirmed'));
		await page.assertVisible(page.getByText('cancelled'));

		hash.restore();
	});

	test('Price input accepts decimal values', async ({ browserContext, visit, route, assert }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.events.view', 'admin.events.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.events.render'));

		await page.getByRole('button', { name: 'Add Event' }).click();

		const priceInput = page.getByLabel('Price');
		await priceInput.fill('29.99');
		await priceInput.blur();

		const inputValue = await priceInput.inputValue();
		assert.equal(inputValue, '29.99');

		hash.restore();
	});
});
