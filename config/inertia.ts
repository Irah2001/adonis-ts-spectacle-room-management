import { defineConfig } from '@adonisjs/inertia';
import type { InferSharedProps } from '@adonisjs/inertia/types';

const inertiaConfig = defineConfig({
	/**
	 * Path to the Edge view that will be used as the root view for Inertia responses
	 */
	rootView: 'inertia-layout',

	/**
	 * Data that should be shared with all rendered pages
	 */
	sharedData: {
		user: async (context) => {
			try {
				await context.auth.authenticate();
			} catch {
				return;
			}

			return context.auth.user!.serialize({ fields: ['email'] });
		},
		errors: (context) => context.session.flashMessages.get('errors') as unknown,
		notification: (context) => context.session.flashMessages.get('notification') as unknown,
	},

	/**
	 * Options for the server-side rendering
	 */
	ssr: {
		enabled: true,
		entrypoint: 'inertia/app/ssr.tsx',
	},
});

export default inertiaConfig;

declare module '@adonisjs/inertia/types' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	export interface SharedProps extends InferSharedProps<typeof inertiaConfig> {}
}
