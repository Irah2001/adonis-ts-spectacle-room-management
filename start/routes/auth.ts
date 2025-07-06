import router from '@adonisjs/core/services/router';

import { middleware } from '../kernel.js';

const RegisterController = () => import('#controllers/auth/register-controller');
const LoginController = () => import('#controllers/auth/login-controller');
const LogoutController = () => import('#controllers/auth/logout-controller');
const VerifyEmailController = () => import('#controllers/auth/verify-email-controller');
const PasswordResetController = () => import('#controllers/auth/password-reset-controller');

router
	.group(() => {
		router.get('register', [RegisterController, 'render']).as('register.render');
		router.post('register', [RegisterController]).as('register.handle');

		router.get('login', [LoginController, 'render']).as('login.render');
		router.post('login', [LoginController]).as('login.handle');

		router.get('verify-email/:token?', [VerifyEmailController, 'render']).as('verify-email.render');
		router.post('verify-email/resend', [VerifyEmailController, 'resend']).as('verify-email.resend');
		router.post('verify-email/:token', [VerifyEmailController]).as('verify-email.handle');

		router.get('forgot-password', [PasswordResetController, 'renderForgot']).as('forgot-password.renderForgot');
		router.post('forgot-password', [PasswordResetController, 'sendMail']).as('forgot-password.sendMail');
		router.get('password-reset/:token?', [PasswordResetController, 'renderReset']).as('password-reset.renderReset');
		router.patch('password-reset/:token', [PasswordResetController, 'update']).as('password-reset.update');
	})
	.prefix('auth')
	.as('auth')
	.middleware(middleware.guest());

router.delete('logout', [LogoutController]).as('logout.handle');
