import { Link } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';

import { ForgotPasswordForm } from '~/components/forms/forgot-password-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

export default function ForgotPassword() {
	return (
		<Card className="my-auto w-full max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Forgot your password?</CardTitle>
				<CardDescription>
					Don't worry, it happens to the best of us! Enter your email below and we'll help!
				</CardDescription>
			</CardHeader>
			<CardContent>
				<ForgotPasswordForm />
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
