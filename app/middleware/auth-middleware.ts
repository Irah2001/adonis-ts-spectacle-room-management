import type { Authenticators } from '@adonisjs/auth/types';
import type { HttpContext } from '@adonisjs/core/http';
import router from '@adonisjs/core/services/router';
import type { NextFn } from '@adonisjs/core/types/http';

/**
 * Auth middleware is used authenticate HTTP requests and deny
 * access to unauthenticated users.
 */
export default class AuthMiddleware {
	async handle(
		context: HttpContext,
		next: NextFn,
		options: {
			guards?: (keyof Authenticators)[];
		} = {},
	) {
		const redirectTo = context.request.url();

		await context.auth.authenticateUsing(options.guards, {
			loginRoute: router.builder().qs({ redirectTo }).make('auth.login.render'),
		});

		return next() as unknown;
	}
}
