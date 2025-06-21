import type { HttpContext } from '@adonisjs/core/http';

import { NotificationType } from '#types/notification';

export default class LogoutController {
	async handle({ auth, response, session }: HttpContext) {
		await auth.use('web').logout();

		session.flash('notification', {
			type: NotificationType.Success,
			message: 'You have been successfully logged out',
		});

		response.redirect().toRoute('home');
	}
}
