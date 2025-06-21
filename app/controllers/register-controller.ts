import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';
import router from '@adonisjs/core/services/router';
import mail from '@adonisjs/mail/services/main';

import VerifyEmailNotification from '#mails/verify-email-notification';
import User from '#models/user';
import VerifyEmailService from '#services/verify-email-service';
import { NotificationType } from '#types/notification';
import { registerValidator } from '#validators/auth';

export default class RegisterController {
	async render({ inertia }: HttpContext) {
		return inertia.render('auth/register');
	}

	/* eslint-disable-next-line @typescript-eslint/member-ordering */
	@inject()
	async handle({ request, session, response }: HttpContext, verifyEmailService: VerifyEmailService) {
		const { email, password } = await request.validateUsing(registerValidator(true));
		const user = await User.create({ email, password });

		await user.save();

		const token = await verifyEmailService.generateToken(user);

		await mail.sendLater(new VerifyEmailNotification(user, token));

		session.flash('notification', {
			type: NotificationType.Info,
			message: 'Please check your emails to verify your account',
			actionLabel: 'Resend email',
			actionUrl: router.makeUrl('auth.verify-email.resend'),
			actionMethod: 'post',
			actionBody: { email: user.email },
		});

		response.redirect().toRoute('auth.login.render');
	}
}
