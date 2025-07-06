import { useEffect } from 'react';

import { vineResolver } from '@hookform/resolvers/vine';
import { Link, router, usePage } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';
import queryString from 'query-string';
import { useForm } from 'react-hook-form';

import { NotificationType } from '#types/notification';
import { loginValidator, type LoginSchema } from '#validators/auth';

import { handleNotification } from '~/lib/handle-notification';

import { PasswordInput } from '../password-input';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

export function LoginForm() {
	const pageProps = usePage().props;

	const form = useForm<LoginSchema>({
		mode: 'onChange',
		resolver: vineResolver(loginValidator),
		defaultValues: {
			email: '',
			password: '',
			rememberMe: false,
		},
	});

	useEffect(() => {
		if (!('errors' in pageProps)) {
			return;
		}

		const { errors } = pageProps;
		const errorKeys = Object.keys(errors);

		for (const errorKey of errorKeys) {
			form.setError(errorKey === 'E_INVALID_CREDENTIALS' ? 'email' : (errorKey as keyof LoginSchema), {
				type: 'manual',
				message: errors[errorKey],
			});
		}
	}, [pageProps.errors]);

	function onSubmit(data: LoginSchema) {
		const url = new URL(route('auth.login.handle').path, location.origin);
		const query = queryString.parse(location.search);
		const redirectTo = Array.isArray(query.redirectTo) ? undefined : query.redirectTo;

		url.searchParams.set('redirectTo', redirectTo ?? '');

		router.post(url, data, {
			onError: () => {
				handleNotification({
					type: NotificationType.Error,
					message: 'An error has occurred, please try again',
				});
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
										<PasswordInput autoComplete="current-password" field={field} />
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="rememberMe"
								render={({ field }) => (
									<FormItem className="flex space-y-0 space-x-2">
										<FormControl>
											<Checkbox checked={!!field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<FormLabel className="text-xs font-normal">Remember me</FormLabel>
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-2">
							<Link
								href={route('auth.forgot-password.renderForgot').path}
								className="ml-auto inline-block text-sm underline"
							>
								Forgot your password?
							</Link>
						</div>
						<Button type="submit" className="mt-4 w-full" disabled={disableSubmit}>
							Login
						</Button>
					</div>
				</fieldset>
			</form>
		</Form>
	);
}
