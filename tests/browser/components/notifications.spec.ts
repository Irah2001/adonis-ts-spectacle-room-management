import { test } from '@japa/runner';

import env from '#start/env';
import { NotificationType } from '#types/notification';

test.group('Notifications component', () => {
	test('Show success notification', async ({ visit, route, browserContext }) => {
		const notification = {
			type: NotificationType.Success,
			message: 'Success notification',
		};

		// We visit the page first to ensure that the flash message is set on firefox and webkit
		await visit(route('home'));

		await browserContext.setFlashMessages({
			notification,
		});

		const page = await visit(route('home'));

		await page.waitForSelector(`.toast[data-type="${notification.type}"]`);

		await page.assertVisible(page.getByText(notification.message));
	});

	test('Show error notification', async ({ visit, route, browserContext }) => {
		const notification = {
			type: NotificationType.Error,
			message: 'Error notification',
		};

		// We visit the page first to ensure that the flash message is set on firefox and webkit
		await visit(route('home'));

		await browserContext.setFlashMessages({
			notification,
		});

		const page = await visit(route('home'));

		await page.waitForSelector(`.toast[data-type="${notification.type}"]`);

		await page.assertVisible(page.getByText(notification.message));
	});

	test('Show info notification', async ({ visit, route, browserContext }) => {
		const notification = {
			type: NotificationType.Info,
			message: 'Info notification',
		};

		// We visit the page first to ensure that the flash message is set on firefox and webkit
		await visit(route('home'));

		await browserContext.setFlashMessages({
			notification,
		});

		const page = await visit(route('home'));

		await page.waitForSelector(`.toast[data-type="${notification.type}"]`);

		await page.assertVisible(page.getByText(notification.message));
	});

	test('Show warning notification', async ({ visit, route, browserContext }) => {
		const notification = {
			type: NotificationType.Warning,
			message: 'Warning notification',
		};

		// We visit the page first to ensure that the flash message is set on firefox and webkit
		await visit(route('home'));

		await browserContext.setFlashMessages({
			notification,
		});

		const page = await visit(route('home'));

		await page.waitForSelector(`.toast[data-type="${notification.type}"]`);

		await page.assertVisible(page.getByText(notification.message));
	});

	test('Show action notification', async ({ visit, route, browserContext }) => {
		const notification = {
			type: NotificationType.Info,
			message: 'Action notification',
			actionLabel: 'Execute action',
			actionUrl: '/action',
			actionMethod: 'post',
			actionBody: { test: 'test' },
		};

		// We visit the page first to ensure that the flash message is set on firefox and webkit
		await visit(route('home'));

		await browserContext.setFlashMessages({
			notification,
		});

		const page = await visit(route('home'));

		await page.assertVisible(page.getByText(notification.message));
		await page.assertVisible(page.getByRole('button', { name: notification.actionLabel }));
	});

	test('Execute action from action notification when clicking action button', async ({
		visit,
		route,
		browserContext,
	}) => {
		const notification = {
			type: NotificationType.Info,
			message: 'Action notification',
			actionLabel: 'Execute action',
			actionUrl: '/action',
			actionMethod: 'post',
			actionBody: { test: 'test' },
		};

		// We visit the page first to ensure that the flash message is set on firefox and webkit
		await visit(route('home'));

		await browserContext.setFlashMessages({
			notification,
		});

		const page = await visit(route('home'));

		await page.waitForSelector(`.toast[data-type="${notification.type}"]`);

		const executeActionButton = page.getByRole('button', { name: notification.actionLabel });
		const requestPromise = page.waitForRequest(
			(request) =>
				request.url() === `${env.get('APP_URL')}${notification.actionUrl}` &&
				request.method().toLocaleLowerCase() === notification.actionMethod &&
				request.postData() === JSON.stringify(notification.actionBody),
		);

		await executeActionButton.click();

		await requestPromise;
	});
});
