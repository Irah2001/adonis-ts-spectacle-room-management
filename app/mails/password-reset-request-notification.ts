import router from '@adonisjs/core/services/router';
import { BaseMail } from '@adonisjs/mail';
import dedent from 'dedent';

import type User from '#models/user';
import env from '#start/env';

export default class PasswordResetRequestNotification extends BaseMail {
	from = env.get('APP_EMAIL');
	subject = 'Password Reset Request';

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
		const passwordResetUrl = router
			.builder()
			.prefixUrl(env.get('APP_URL'))
			.params({ token: this.token })
			.make('auth.password-reset.renderReset');

		this.message.to(this.user.email).text(
			dedent(`Hi!
		
				You have requested to reset your password. Click the link below to reset your password (valid for 20 minutes):
				${passwordResetUrl}

				If you are not the author of this request, please ignore this email.
		
				Sincerely,
				ConPanion Team`),
		);
	}
}
