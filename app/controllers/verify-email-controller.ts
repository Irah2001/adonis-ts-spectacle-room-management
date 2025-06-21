import { inject } from '@adonisjs/core';
import type { HttpContext } from '@adonisjs/core/http';
import mail from '@adonisjs/mail/services/main';

import VerifyEmailNotification from '#mails/verify-email-notification';
import User from '#models/user';
import VerifyEmailService from '#services/verify-email-service';
import { NotificationType } from '#types/notification';
import { verifyEmailValidator } from '#validators/auth';

export default class VerifyEmailController {
	@inject()
	async render({ params, session, response, inertia }: HttpContext, verifyEmailService: VerifyEmailService) {
		const token = params.token as string;

		if (!token) {
			session.flash('notification', {
				type: NotificationType.Error,
				message: 'Verify email token missing',
			});

			response.redirect().toRoute('auth.login.render');

			return;
		}

		const isTokenValid = await verifyEmailService.verifyToken(token);

		if (!isTokenValid) {
			session.flash('notification', {
				type: NotificationType.Error,
				message: 'Invalid or expired verify email token',
			});

			response.redirect().toRoute('auth.login.render');

			return;
		}

		return inertia.render('auth/verify-email', { token });
	}

	@inject()
	async handle({ params, response, session }: HttpContext, verifyEmailService: VerifyEmailService) {
		const token = params.token as string;

		if (!token) {
			session.flash('notification', {
				type: NotificationType.Error,
				message: 'verify email token missing',
			});

			response.redirect().toRoute('auth.login.render');

			return;
		}

		const user = await verifyEmailService.getUserByToken(token);

		if (!user) {
			session.flash('notification', {
				type: NotificationType.Error,
				message: 'Invalid/expired verify email token or user not found',
			});

			response.redirect().toRoute('auth.login.render');

			return;
		}

		if (user.isVerified) {
			session.flash('notification', {
				type: NotificationType.Error,
				message: 'Your email has already been verified',
			});

			response.redirect().toRoute('auth.login.render');

			return;
		}

		await user.merge({ isVerified: true }).save();
		await verifyEmailService.clearPreviousToken(user);

		session.flash('notification', {
			type: NotificationType.Success,
			message: 'Your email has been successfully verified',
		});

		response.redirect().toRoute('auth.login.render');
	}

	@inject()
	async resend({ request, session, response }: HttpContext, verifyEmailService: VerifyEmailService) {
		const { email } = await request.validateUsing(verifyEmailValidator);
		const user = await User.findBy('email', email);

		if (!user) {
			session.flash('notification', {
				type: NotificationType.Error,
				message: 'User not found',
			});

			response.redirect().back();

			return;
		}

		if (user.isVerified) {
			session.flash('notification', {
				type: NotificationType.Error,
				message: 'Your email has already been verified',
			});

			response.redirect().back();

			return;
		}

		const token = await verifyEmailService.generateToken(user);

		await mail.sendLater(new VerifyEmailNotification(user, token));

		response.redirect().back();
	}
}
