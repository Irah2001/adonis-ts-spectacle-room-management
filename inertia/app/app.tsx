/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/auth.ts" />

import '../css/app.css';

import { resolvePageComponent } from '@adonisjs/inertia/helpers';
import { createInertiaApp } from '@inertiajs/react';
import { hydrateRoot } from 'react-dom/client';

import { AppLayout } from '~/layouts/app-layout';

const appName = (import.meta.env.VITE_APP_NAME as string) || 'venue-name';

createInertiaApp({
	progress: { color: '#5468FF' },

	title: (title) => (title ? `${title} - ${appName}` : appName),

	resolve: async (name) => {
		const page = await resolvePageComponent(`../pages/${name}.tsx`, import.meta.glob('../pages/**/*.tsx'));

		/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access */
		// @ts-expect-error Page is unknown
		page.default.layout = page.default.layout ?? ((app) => <AppLayout>{app}</AppLayout>);

		return page;
	},

	setup({ el, App, props }) {
		hydrateRoot(el, <App {...props} />);
	},
});
