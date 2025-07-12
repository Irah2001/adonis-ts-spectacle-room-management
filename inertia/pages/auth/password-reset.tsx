import type { InferPageProps } from '@adonisjs/inertia/types';
import { Link } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';

import type PasswordResetController from '#controllers/auth/password-reset-controller';

import { PasswordResetForm } from '~/components/forms/password-reset-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

export default function ForgotPassword({ token }: InferPageProps<PasswordResetController, 'renderReset'>) {
	return (
		<Card className="my-auto w-full max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Password Reset</CardTitle>
				<CardDescription>Enter your new password below to reset your password</CardDescription>
			</CardHeader>
			<CardContent>
				<PasswordResetForm token={token} />
				<div className="mt-4 text-center text-sm">
					Remember it?{' '}
					<Link href={route('auth.login.render').path} className="underline">
						Sign in
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
