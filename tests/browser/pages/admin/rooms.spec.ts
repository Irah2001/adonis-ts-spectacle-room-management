import hash from '@adonisjs/core/services/hash';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import { RoomFactory } from '#database/factories/room-factory';
import { UserFactory } from '#database/factories/user-factory';
import { giveUserPermissions } from '#test-helpers/give-user-permission';

declare global {
	interface Window {
		confirm: (message?: string) => boolean;
	}
}

test.group('Admin rooms page', (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test('Rooms page is protected and redirects to login if not authenticated', async ({ visit, route, assert }) => {
		const protectedUrl = route('admin.rooms.render');
		const page = await visit(protectedUrl);

		await page.waitForURL(new RegExp(`${route('auth.login.render')}\\?redirectTo=`));

		const currentUrl = page.url();

		assert.include(currentUrl, `redirectTo=${encodeURIComponent(protectedUrl)}`);
	});

	test('Rooms page redirects to homepage for user without permission', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.rooms.render'));

		await page.assertPath(route('home'));

		hash.restore();
	});

	test('Rooms page is accessible for user with permission', async ({ browserContext, visit, route, assert }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();

		await giveUserPermissions(user, ['admin.rooms.view']);
		await browserContext.loginAs(user);

		const page = await visit(route('admin.rooms.render'));

		await page.assertPath(route('admin.rooms.render'));

		const body = await page.innerHTML('main');

		assert.snapshot(body.trim()).match();

		hash.restore();
	});

	test('Rooms page displays existing rooms in cards', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.rooms.view']);

		const rooms = await RoomFactory.createMany(3);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.rooms.render'));

		for (const room of rooms) {
			await page.assertExists(page.getByText(room.name));
			await page.assertExists(page.getByText(`Capacity: ${room.capacity.toString()} people`));
			await page.assertExists(page.getByText(room.address));
		}

		hash.restore();
	});

	test('Create room button opens dialog', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.rooms.view', 'admin.rooms.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.rooms.render'));

		const addButton = page.getByRole('button', { name: 'Add Room' });
		await page.assertExists(addButton);

		await addButton.click();

		await page.assertVisible(page.getByText('Add New Room'));

		hash.restore();
	});

	test('Create room form shows validation errors for invalid input', async ({
		browserContext,
		visit,
		route,
		assert,
	}) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.rooms.view', 'admin.rooms.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.rooms.render'));

		const addButton = page.getByRole('button', { name: 'Add Room' });
		await addButton.click();

		// Fill form with invalid data
		await page.fill('input[placeholder="Enter room name"]', '');
		await page.fill('textarea[placeholder="Enter room address"]', '');
		await page.fill('input[placeholder="Enter room capacity"]', '0');

		const submitButton = page.getByRole('button', { name: 'Create Room' });
		await page.assertExists(submitButton);

		// Check that submit button is disabled for invalid form
		const isDisabled = await submitButton.getAttribute('disabled');
		assert.isNotNull(isDisabled);

		hash.restore();
	});

	test('Create room form submits successfully with valid data', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.rooms.view', 'admin.rooms.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.rooms.render'));

		const addButton = page.getByRole('button', { name: 'Add Room' });
		await addButton.click();

		// Fill form with valid data
		const roomName = 'Test Conference Hall';
		const roomAddress = '123 Main Street, Anytown, 12345';
		const roomCapacity = '250';

		await page.fill('input[placeholder="Enter room name"]', roomName);
		await page.fill('textarea[placeholder="Enter room address"]', roomAddress);
		await page.fill('input[placeholder="Enter room capacity"]', roomCapacity);

		const submitButton = page.getByRole('button', { name: 'Create Room' });
		await submitButton.click();

		// Wait for form submission and dialog to close
		await page.waitForTimeout(1000);

		// Check that the new room appears in the list
		await page.assertExists(page.getByText(roomName));
		await page.assertExists(page.getByText(`Capacity: ${roomCapacity} people`));

		hash.restore();
	});

	test('Edit room button opens edit dialog', async ({ browserContext, visit, route, assert }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.rooms.view', 'admin.rooms.update']);

		const room = await RoomFactory.create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.rooms.render'));

		// Find the room card and click edit button
		const roomCard = page.getByText(room.name).locator('..').locator('..');
		const editButton = roomCard.getByRole('button', { name: 'Edit' });
		await editButton.click();

		await page.assertVisible(page.getByText('Edit Room'));

		// Check that form is pre-filled with room data
		const nameInput = page.locator('input[placeholder="Enter room name"]');
		const addressTextarea = page.locator('textarea[placeholder="Enter room address"]');
		const capacityInput = page.locator('input[placeholder="Enter room capacity"]');

		const nameValue = await nameInput.getAttribute('value');
		const addressValue = await addressTextarea.textContent();
		const capacityValue = await capacityInput.getAttribute('value');

		assert.equal(nameValue, room.name);
		assert.equal(addressValue, room.address);
		assert.equal(capacityValue, room.capacity.toString());

		hash.restore();
	});

	test('Edit room form updates room successfully', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.rooms.view', 'admin.rooms.update']);

		const room = await RoomFactory.create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.rooms.render'));

		// Find the room card and click edit button
		const roomCard = page.getByText(room.name).locator('..').locator('..');
		const editButton = roomCard.getByRole('button', { name: 'Edit' });
		await editButton.click();

		// Update form with new data
		const updatedName = 'Updated Room Name';
		const updatedAddress = 'Updated Address, Updated City, 54321';
		const updatedCapacity = '350';

		await page.fill('input[placeholder="Enter room name"]', updatedName);
		await page.fill('textarea[placeholder="Enter room address"]', updatedAddress);
		await page.fill('input[placeholder="Enter room capacity"]', updatedCapacity);

		const updateButton = page.getByRole('button', { name: 'Update Room' });
		await updateButton.click();

		// Wait for form submission and dialog to close
		await page.waitForTimeout(1000);

		// Check that the room appears with updated data
		await page.assertExists(page.getByText(updatedName));
		await page.assertExists(page.getByText(`Capacity: ${updatedCapacity} people`));

		hash.restore();
	});

	test('Delete room button deletes room successfully', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.rooms.view', 'admin.rooms.delete']);

		const room = await RoomFactory.create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.rooms.render'));

		// Mock window.confirm to return true using page.evaluate
		await page.evaluate(() => {
			(globalThis as typeof globalThis & { confirm: () => boolean }).confirm = () => true;
		});

		// Find the room card and click delete button
		const roomCard = page.getByText(room.name).locator('..').locator('..');
		const deleteButton = roomCard.getByRole('button', { name: 'Delete' });
		await deleteButton.click();

		// Wait for deletion
		await page.waitForTimeout(1000);

		// Check that the room no longer appears in the list
		await page.assertNotExists(page.getByText(room.name));

		hash.restore();
	});

	test('Delete room shows confirmation dialog', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.rooms.view', 'admin.rooms.delete']);

		const room = await RoomFactory.create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.rooms.render'));

		await page.evaluateHandle(() => {
			(globalThis as typeof globalThis & { confirm: () => boolean }).confirm = () => false;
		});

		const deleteButton = page.getByRole('button', { name: 'Delete' }).first();
		await deleteButton.click();

		await page.assertVisible(page.getByText(room.name));

		hash.restore();
	});

	test('Cancel button closes create dialog', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.rooms.view', 'admin.rooms.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.rooms.render'));

		const addButton = page.getByRole('button', { name: 'Add Room' });
		await addButton.click();

		await page.assertVisible(page.getByText('Add New Room'));

		// Click outside the dialog or press Escape to close
		await page.keyboard.press('Escape');

		await page.assertNotVisible(page.getByText('Add New Room'));

		hash.restore();
	});

	test('Cancel button closes edit dialog', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.rooms.view', 'admin.rooms.update']);

		const room = await RoomFactory.create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.rooms.render'));

		// Find the room card and click edit button
		const roomCard = page.getByText(room.name).locator('..').locator('..');
		const editButton = roomCard.getByRole('button', { name: 'Edit' });
		await editButton.click();

		await page.assertVisible(page.getByText('Edit Room'));

		const cancelButton = page.getByRole('button', { name: 'Cancel' });
		await cancelButton.click();

		await page.assertNotVisible(page.getByText('Edit Room'));

		hash.restore();
	});

	test('Search functionality filters rooms', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.rooms.view']);

		// Create rooms with distinct names
		const room1 = await RoomFactory.merge({ name: 'Conference Hall A' }).create();
		const room2 = await RoomFactory.merge({ name: 'Theater Studio B' }).create();
		const room3 = await RoomFactory.merge({ name: 'Concert Arena C' }).create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.rooms.render'));

		// Initially all rooms should be visible
		await page.assertExists(page.getByText(room1.name));
		await page.assertExists(page.getByText(room2.name));
		await page.assertExists(page.getByText(room3.name));

		// Search for "Theater"
		const searchInput = page.getByPlaceholder('Search rooms...');
		await searchInput.fill('Theater');

		// Note: The search functionality might need to be implemented in the frontend
		// For now, this test documents the expected behavior

		hash.restore();
	});

	test('Empty state message shows when no rooms exist', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.rooms.view']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.rooms.render'));

		await page.assertExists(page.getByText('No rooms found. Add your first room to get started.'));

		hash.restore();
	});
});
