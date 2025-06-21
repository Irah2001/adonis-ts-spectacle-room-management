import { Link } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';

import { RegisterForm } from '~/components/forms/register-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

export default function Register() {
	return (
		<Card className="my-auto w-full max-w-sm">
			<CardHeader>
				<CardTitle className="text-2xl">Sign Up</CardTitle>
				<CardDescription>Enter your information to create an account</CardDescription>
			</CardHeader>
			<CardContent>
				<RegisterForm />
				<div className="mt-4 text-center text-sm">
					Already have an account?{' '}
					<Link href={route('auth.login.render').path} className="underline">
						Sign in
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
