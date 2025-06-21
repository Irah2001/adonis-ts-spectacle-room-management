import { router } from '@inertiajs/react';

import { MethodType } from '#types/notification';

interface RequestProps {
	url: string;
	method: MethodType;
	body?: Record<string, string>;
	options: Record<string, unknown>;
}

export function sendRequest({ url, method, body, options }: RequestProps) {
	switch (method) {
		case MethodType.Get: {
			router.get(url, undefined, options);

			break;
		}

		case MethodType.Post: {
			router.post(url, body, options);

			break;
		}

		case MethodType.Put: {
			router.put(url, body, options);

			break;
		}

		case MethodType.Delete: {
			router.delete(url, options);

			break;
		}

		case MethodType.Patch: {
			router.patch(url, body, options);

			break;
		}

		default: {
			break;
		}
	}
}
