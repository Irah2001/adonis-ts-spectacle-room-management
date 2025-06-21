import { useEffect } from 'react';

import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';

import type { NotificationFlash } from '#types/notification';

import { useMounted } from '~/hooks/use-mounted';
import { handleNotification } from '~/lib/handle-notification';

import { Toaster } from './ui/sonner';

export function Notifications() {
	const { notification } = usePage().props;
	const mounted = useMounted();

	useEffect(() => {
		if (!mounted || !notification) {
			return;
		}

		const id = handleNotification(notification as NotificationFlash);

		return () => {
			toast.dismiss(id);
		};
	}, [notification, mounted]);

	return <Toaster richColors closeButton />;
}
