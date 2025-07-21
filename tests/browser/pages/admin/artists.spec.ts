import hash from '@adonisjs/core/services/hash';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import { ParticipantFactory } from '#database/factories/participant-factory';
import { UserFactory } from '#database/factories/user-factory';
import { giveUserPermissions } from '#test-helpers/give-user-permission';

declare global {
	interface Window {
		confirm: (message?: string) => boolean;
	}
}

test.group('Admin artists page', (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test('Artists page is protected and redirects to login if not authenticated', async ({ visit, route, assert }) => {
		const protectedUrl = route('admin.artists.render');
		const page = await visit(protectedUrl);

		await page.waitForURL(new RegExp(`${route('auth.login.render')}\\?redirectTo=`));

		const currentUrl = page.url();

		assert.include(currentUrl, `redirectTo=${encodeURIComponent(protectedUrl)}`);
	});

	test('Artists page redirects to homepage for user without permission', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.artists.render'));

		await page.assertPath(route('home'));

		hash.restore();
	});

	test('Artists page is accessible for user with permission', async ({ browserContext, visit, route, assert }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();

		await giveUserPermissions(user, ['admin.artists.view']);
		await browserContext.loginAs(user);

		const page = await visit(route('admin.artists.render'));

		await page.assertPath(route('admin.artists.render'));

		const body = await page.innerHTML('main');

		assert.snapshot(body.trim()).match();

		hash.restore();
	});

	test('Artists page displays existing artists in cards', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.artists.view']);

		const artists = await ParticipantFactory.createMany(3);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.artists.render'));

		for (const artist of artists) {
			await page.assertVisible(page.getByText(artist.businessName));
			await page.assertVisible(page.getByText(artist.email));
			await page.assertVisible(page.getByText(artist.phoneNumber));
		}

		hash.restore();
	});

	test('Create artist button opens dialog', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.artists.view', 'admin.artists.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.artists.render'));

		const addButton = page.getByRole('button', { name: 'Add Artist' });
		await page.assertExists(addButton);

		await addButton.click();

		await page.assertVisible(page.getByText('Add New Artist'));
		await page.assertVisible(page.getByText('Enter the details for the new artist or company.'));

		hash.restore();
	});

	test('Create artist form validates required fields', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.artists.view', 'admin.artists.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.artists.render'));

		await page.getByRole('button', { name: 'Add Artist' }).click();

		const submitButton = page.getByRole('button', { name: 'Create Artist' });

		await page.assertDisabled(submitButton);

		await page.getByLabel('Business Name').fill('Amazing Music Band');
		await page.assertDisabled(submitButton);

		await page.getByLabel('SIRET Number').fill('12345678901234');
		await page.assertDisabled(submitButton);

		await page.getByLabel('Email').fill('contact@amazingmusic.com');
		await page.assertDisabled(submitButton);

		await page.getByLabel('Phone Number').fill('+33123456789');

		await page.assertNotDisabled(submitButton);

		hash.restore();
	});

	test('Create artist form shows validation errors for invalid input', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.artists.view', 'admin.artists.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.artists.render'));

		await page.getByRole('button', { name: 'Add Artist' }).click();

		await page.getByLabel('SIRET Number').fill('123');
		await page.getByLabel('SIRET Number').blur();

		await page.getByLabel('Email').fill('invalid-email');
		await page.getByLabel('Email').blur();

		hash.restore();
	});

	test('Create artist form submits successfully with valid data', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.artists.view', 'admin.artists.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.artists.render'));

		await page.getByRole('button', { name: 'Add Artist' }).click();

		await page.getByLabel('Business Name').fill('Amazing Music Band');
		await page.getByLabel('SIRET Number').fill('12345678901234');
		await page.getByLabel('Email').fill('contact@amazingmusic.com');
		await page.getByLabel('Phone Number').fill('+33123456789');

		await page.getByRole('button', { name: 'Create Artist' }).click();

		await page.waitForSelector('.toast[data-type="success"]');
		await page.assertVisible(page.getByText('Artist created successfully'));

		await page.assertVisible(page.getByText('Amazing Music Band'));
		await page.assertVisible(page.getByText('contact@amazingmusic.com'));
		await page.assertVisible(page.getByText('+33123456789'));

		hash.restore();
	});

	test('Edit artist button opens edit dialog', async ({ browserContext, visit, route, assert }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.artists.view', 'admin.artists.update']);

		const artist = await ParticipantFactory.create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.artists.render'));

		const editButton = page.getByRole('button', { name: 'Edit' }).first();
		await page.assertExists(editButton);

		await editButton.click();

		await page.assertVisible(page.getByText('Edit Artist'));
		await page.assertVisible(page.getByText('Update the artist information.'));

		const businessNameInput = page.getByLabel('Business Name');
		const siretInput = page.getByLabel('SIRET Number');
		const emailInput = page.getByLabel('Email');
		const phoneInput = page.getByLabel('Phone Number');

		const businessNameValue = await businessNameInput.inputValue();
		const siretValue = await siretInput.inputValue();
		const emailValue = await emailInput.inputValue();
		const phoneValue = await phoneInput.inputValue();

		assert.equal(businessNameValue, artist.businessName);
		assert.equal(siretValue, artist.siret);
		assert.equal(emailValue, artist.email);
		assert.equal(phoneValue, artist.phoneNumber);

		hash.restore();
	});

	test('Edit artist form updates artist successfully', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.artists.view', 'admin.artists.update']);

		await ParticipantFactory.apply('MusicBand').create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.artists.render'));

		const editButton = page.getByRole('button', { name: 'Edit' }).first();
		await editButton.click();

		await page.getByLabel('Business Name').fill('Updated Band Name');
		await page.getByLabel('SIRET Number').fill('98765432109876');
		await page.getByLabel('Email').fill('updated@email.com');
		await page.getByLabel('Phone Number').fill('+33987654321');

		await page.getByRole('button', { name: 'Update Artist' }).click();

		await page.waitForSelector('.toast[data-type="success"]');
		await page.assertVisible(page.getByText('Artist updated successfully'));

		await page.assertVisible(page.getByText('Updated Band Name'));
		await page.assertVisible(page.getByText('updated@email.com'));
		await page.assertVisible(page.getByText('+33987654321'));

		hash.restore();
	});

	test('Delete artist button deletes artist successfully', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.artists.view', 'admin.artists.delete']);

		const participant = await ParticipantFactory.apply('MusicBand').create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.artists.render'));

		await page.evaluateHandle(() => {
			(globalThis as typeof globalThis & { confirm: () => boolean }).confirm = () => true;
		});

		const deleteButton = page.getByRole('button', { name: 'Delete' }).first();
		await deleteButton.click();

		await page.waitForSelector('.toast[data-type="success"]');
		await page.assertVisible(page.getByText('Artist deleted successfully'));

		await page.assertNotVisible(participant.businessName);

		hash.restore();
	});

	test('Delete artist shows confirmation dialog', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.artists.view', 'admin.artists.delete']);

		const participant = await ParticipantFactory.create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.artists.render'));

		await page.evaluateHandle(() => {
			(globalThis as typeof globalThis & { confirm: () => boolean }).confirm = () => false;
		});

		const deleteButton = page.getByRole('button', { name: 'Delete' }).first();
		await deleteButton.click();

		await page.assertVisible(page.getByText(participant.businessName));

		hash.restore();
	});

	test('Cancel button closes create dialog', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.artists.view', 'admin.artists.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.artists.render'));

		await page.getByRole('button', { name: 'Add Artist' }).click();
		await page.assertVisible(page.getByText('Add New Artist'));

		await page.keyboard.press('Escape');

		await page.assertNotVisible(page.getByText('Add New Artist'));

		hash.restore();
	});

	test('Cancel button closes edit dialog', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.artists.view', 'admin.artists.update']);

		await ParticipantFactory.create();
		await browserContext.loginAs(user);

		const page = await visit(route('admin.artists.render'));

		const editButton = page.getByRole('button', { name: 'Edit' }).first();
		await editButton.click();

		await page.assertVisible(page.getByText('Edit Artist'));

		const cancelButton = page.getByRole('button', { name: 'Cancel' });
		await cancelButton.click();

		await page.assertNotVisible(page.getByText('Edit Artist'));

		hash.restore();
	});

	test('Search functionality filters artists', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.artists.view']);

		await ParticipantFactory.apply('MusicBand').create();
		await ParticipantFactory.apply('TheatreCompany').create();
		await ParticipantFactory.apply('SoloArtist').create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.artists.render'));

		await page.assertVisible(page.getByText('The Rock Stars'));
		await page.assertVisible(page.getByText('Drama Theatre Company'));
		await page.assertVisible(page.getByText('John Doe Solo'));

		const searchInput = page.getByPlaceholder('Search artists...');
		await page.assertExists(searchInput);

		hash.restore();
	});

	test('Empty state message shows when no artists exist', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.artists.view']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.artists.render'));

		await page.assertVisible(page.getByText('No artists found. Add your first artist to get started.'));

		hash.restore();
	});

	test('SIRET number input validates length', async ({ browserContext, visit, route, expect }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.artists.view', 'admin.artists.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.artists.render'));

		await page.getByRole('button', { name: 'Add Artist' }).click();

		const siretInput = page.getByLabel('SIRET Number');

		await siretInput.fill('12345678901234');
		await siretInput.blur();

		await siretInput.fill('123456789012345678');

		const value = await siretInput.inputValue();
		expect(value).toHaveLength(14);

		hash.restore();
	});
});
