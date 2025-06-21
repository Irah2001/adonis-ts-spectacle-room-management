import { useEffect } from 'react';

import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

import { NotificationType, type NotificationFlash } from '#types/notification';

import { useMounted } from '~/hooks/use-mounted';
import { handleNotification } from '~/lib/handle-notification';

import { Toaster } from './ui/sonner';

export function Notifications() {
	const { notification, errors } = usePage().props;
	const mounted = useMounted();

	useEffect(() => {
		if (!mounted || !(notification && (errors as unknown))) {
			return;
		}

		const errorMessages = Object.values(errors).filter((errorMessage) => typeof errorMessage === 'string') as string[];

		const toastIds =
			errorMessages.length > 0
				? errorMessages.map((errorMessage) =>
						handleNotification({ message: errorMessage, type: NotificationType.Error }),
					)
				: [handleNotification(notification as NotificationFlash)];

		return () => {
			for (const toastId of toastIds) {
				toast.dismiss(toastId);
			}
		};
	}, [notification, mounted]);

	return <Toaster richColors closeButton />;
}
