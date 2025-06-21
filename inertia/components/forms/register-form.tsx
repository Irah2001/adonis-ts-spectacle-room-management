import { useEffect } from 'react';

import { vineResolver } from '@hookform/resolvers/vine';
import { router, usePage } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';
import { useForm } from 'react-hook-form';

import { NotificationType } from '#types/notification';
import { registerValidator, type RegisterSchema } from '#validators/auth';

import { handleNotification } from '~/lib/handle-notification';

import { PasswordInput } from '../password-input';
import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

export function RegisterForm() {
	const pageProps = usePage().props;

	const form = useForm<RegisterSchema>({
		mode: 'onChange',
		resolver: vineResolver(registerValidator(false)),
		defaultValues: {
			email: '',
			password: '',
			passwordConfirmation: '',
		},
	});

	useEffect(() => {
		if (!('errors' in pageProps)) {
			return;
		}

		const { errors } = pageProps;
		const errorKeys = Object.keys(errors);

		for (const errorKey of errorKeys) {
			form.setError(errorKey as keyof RegisterSchema, { type: 'manual', message: errors[errorKey] });
		}
	}, [pageProps.errors]);

	function onSubmit(data: RegisterSchema) {
		router.post(route('auth.register.handle').path, data, {
			onError: () => {
				handleNotification({ type: NotificationType.Error, message: 'An error has occurred, please try again' });
			},
		});
	}

	const disableSubmit = !form.formState.isValid || Object.keys(form.formState.errors).length > 0;

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
				<fieldset disabled={form.formState.isSubmitting}>
					<div className="grid gap-4">
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input className="bg-muted w-full text-base" required autoComplete="email" {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Password</FormLabel>
										<PasswordInput autoComplete="new-password" field={field} />
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="passwordConfirmation"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Confirm password</FormLabel>
										<PasswordInput placeholder="Repeat your password" autoComplete="new-password" field={field} />
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type="submit" className="mt-4 w-full" disabled={disableSubmit}>
							Create an account
						</Button>
					</div>
				</fieldset>
			</form>
		</Form>
	);
}
