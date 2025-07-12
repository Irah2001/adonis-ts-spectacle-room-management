import { useEffect } from 'react';

import type { InferPageProps } from '@adonisjs/inertia/types';
import { vineResolver } from '@hookform/resolvers/vine';
import { router, usePage } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';
import { useForm } from 'react-hook-form';

import type PasswordResetController from '#controllers/auth/password-reset-controller';
import { NotificationType } from '#types/notification';
import { passwordResetValidator, type PasswordResetSchema } from '#validators/auth';

import { handleNotification } from '~/lib/handle-notification';

import { PasswordInput } from '../password-input';
import { Button } from '../ui/button';
import { Form, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';

export function PasswordResetForm({ token }: InferPageProps<PasswordResetController, 'renderReset'>) {
	const pageProps = usePage().props;

	const form = useForm<PasswordResetSchema>({
		mode: 'onChange',
		resolver: vineResolver(passwordResetValidator),
		defaultValues: {
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
			form.setError(errorKey as keyof PasswordResetSchema, { type: 'manual', message: errors[errorKey] });
		}
	}, [pageProps.errors]);

	function onSubmit(data: PasswordResetSchema) {
		router.patch(route('auth.password-reset.update', { params: { token } }).path, data, {
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
								name="password"
								render={({ field }) => (
									<FormItem>
										<FormLabel>New password</FormLabel>
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
										<FormLabel>Confirm new password</FormLabel>
										<PasswordInput placeholder="Repeat your password" autoComplete="new-password" field={field} />
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type="submit" className="mt-4 w-full" disabled={disableSubmit}>
							Reset Password
						</Button>
					</div>
				</fieldset>
			</form>
		</Form>
	);
}
