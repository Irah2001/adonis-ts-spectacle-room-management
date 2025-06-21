import { toast } from 'sonner';

import { NotificationType, type NotificationFlash } from '#types/notification';

import { sendRequest } from './send-action-request';

// eslint-disable-next-line sonarjs/function-return-type
export function handleNotification(notification: NotificationFlash) {
	const options =
		'actionLabel' in notification
			? {
					action: {
						label: notification.actionLabel,
						onClick: () => {
							sendRequest({
								url: notification.actionUrl,
								method: notification.actionMethod,
								body: notification.actionBody,
								options: {
									onError: () => {
										handleNotification({
											type: NotificationType.Error,
											message: 'An error has occurred, please try again',
										});
									},
								},
							});
						},
					},
				}
			: {};

	switch (notification.type) {
		case NotificationType.Success: {
			return toast.success(notification.message, options);
		}

		case NotificationType.Error: {
			return toast.error(notification.message, options);
		}

		case NotificationType.Info: {
			return toast.info(notification.message, options);
		}

		case NotificationType.Warning: {
			return toast.warning(notification.message, options);
		}

		default: {
			break;
		}
	}
}
