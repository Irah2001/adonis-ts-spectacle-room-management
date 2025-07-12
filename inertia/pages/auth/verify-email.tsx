import type { InferPageProps } from '@adonisjs/inertia/types';
import { Link } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';

import type VerifyEmailController from '#controllers/auth/verify-email-controller';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

export default function VerifyEmail({ token }: InferPageProps<VerifyEmailController, 'render'>) {
	return (
		<Card className="my-auto w-full max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Verify Email</CardTitle>
				<CardDescription>Click on the button below to verify you email</CardDescription>
			</CardHeader>
			<CardContent>
				<Link
					className="btn btn-primary"
					href={route('auth.verify-email.handle', { params: { token } }).path}
					method="post"
					as="button"
				>
					Verify Email
				</Link>
			</CardContent>
		</Card>
	);
}
