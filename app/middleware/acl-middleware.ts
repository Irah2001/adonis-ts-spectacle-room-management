import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';

export default class AclMiddleware {
	async handle(context: HttpContext, next: NextFn, options: { permission: string }) {
		const user = context.auth.user!;
		const isSuperAdmin = await user.hasRole('super-admin');
		const hasPermission = await user.hasPermission(options.permission);

		if (!isSuperAdmin && !hasPermission) {
			context.response.redirect().toRoute('home');

			return;
		}

		return next() as unknown;
	}
}
