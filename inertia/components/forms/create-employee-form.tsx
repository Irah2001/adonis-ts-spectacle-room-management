import { useEffect } from 'react';

import { vineResolver } from '@hookform/resolvers/vine';
import { router, usePage } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';
import { useForm } from 'react-hook-form';

import { EMPLOYEE_POSITIONS } from '#types/employee';
import { NotificationType } from '#types/notification';
import { createEmployeeValidator, type CreateEmployeeSchema } from '#validators/employee';

import { handleNotification } from '~/lib/handle-notification';

import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export function CreateEmployeeForm({ onSuccess }: { onSuccess?: () => void }) {
	const pageProps = usePage().props;

	const form = useForm<CreateEmployeeSchema>({
		mode: 'onChange',
		resolver: vineResolver(createEmployeeValidator),
		defaultValues: {
			firstName: '',
			lastName: '',
			position: undefined,
		},
	});

	useEffect(() => {
		if (!('errors' in pageProps)) {
			return;
		}

		const { errors } = pageProps;
		const errorKeys = Object.keys(errors);

		for (const errorKey of errorKeys) {
			form.setError(errorKey as keyof CreateEmployeeSchema, { type: 'manual', message: errors[errorKey] });
		}
	}, [pageProps.errors]);

	function onSubmit(data: CreateEmployeeSchema) {
		router.put(route('admin.employees.create').path, data, {
			onSuccess: () => {
				form.reset();
				onSuccess?.();
			},
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
								name="firstName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>First Name</FormLabel>
										<FormControl>
											<Input required {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="lastName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Last Name</FormLabel>
										<FormControl>
											<Input required {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="position"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Position</FormLabel>
										<Select onValueChange={field.onChange} value={field.value}>
											<FormControl>
												<SelectTrigger className="w-full">
													<SelectValue placeholder="Select a position" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{EMPLOYEE_POSITIONS.map((position) => (
													<SelectItem key={position} value={position}>
														{position}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type="submit" className="mt-4 w-full" disabled={disableSubmit}>
							Create Employee
						</Button>
					</div>
				</fieldset>
			</form>
		</Form>
	);
}
