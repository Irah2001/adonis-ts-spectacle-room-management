import { defineConfig } from '@adonisjs/auth';
import { sessionGuard, sessionUserProvider } from '@adonisjs/auth/session';
import type { Authenticators, InferAuthEvents } from '@adonisjs/auth/types';

const authConfig = defineConfig({
	default: 'web',
	guards: {
		web: sessionGuard({
			useRememberMeTokens: true,
			rememberMeTokensAge: '1 year',
			provider: sessionUserProvider({
				model: () => import('#models/user'),
			}),
		}),
	},
});

export default authConfig;

/**
 * Inferring types from the configured auth
 * guards.
 */
declare module '@adonisjs/auth/types' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface Authenticators extends InferAuthenticators<typeof authConfig> {}
}

declare module '@adonisjs/core/types' {
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	interface EventsList extends InferAuthEvents<Authenticators> {}
}
