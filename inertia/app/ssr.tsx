import { createInertiaApp } from '@inertiajs/react';
import { renderToString } from 'react-dom/server';

import { AppLayout } from '~/layouts/app-layout';

export default function render(pageName: string) {
	return createInertiaApp({
		page: pageName,
		render: renderToString,
		resolve: (name: string) => {
			const pages = import.meta.glob('../pages/**/*.tsx', { eager: true });
			const page = pages[`../pages/${name}.tsx`];

			/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
			// @ts-expect-error Page is unknown
			page.default.layout = page.default.layout ?? ((app) => <AppLayout>{app}</AppLayout>);

			return page;
		},
		setup: ({ App, props }) => <App {...props} />,
	});
}
