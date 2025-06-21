import router from '@adonisjs/core/services/router';
import { BaseMail } from '@adonisjs/mail';
import dedent from 'dedent';

import type User from '#models/user';
import env from '#start/env';

export default class VerifyEmailNotification extends BaseMail {
	from = env.get('APP_EMAIL');
	subject = 'Email Verification';

	constructor(
		public user: User,
		public token: string,
	) {
		super();
	}

	/**
	 * The "prepare" method is called automatically when
	 * the email is sent or queued.
	 */
	prepare() {
		const verifyEmailUrl = router
			.builder()
			.prefixUrl(env.get('APP_URL'))
			.params({ token: this.token })
			.make('auth.verify-email.render');

		this.message.to(this.user.email).text(
			dedent(`Welcome to Con-panion!
		
				Please verify your email address by clicking the link below (valid for 1 day):
				${verifyEmailUrl}
		
				Sincerely,
				ConPanion Team`),
		);
	}
}
