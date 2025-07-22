import { useEffect } from 'react';

import { vineResolver } from '@hookform/resolvers/vine';
import { router, usePage } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';
import { useForm } from 'react-hook-form';

import { NotificationType } from '#types/notification';
import { createRoomValidator, type CreateRoomSchema } from '#validators/room';

import { handleNotification } from '~/lib/handle-notification';

import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';

export function CreateRoomForm({ onSuccess }: { onSuccess?: () => void }) {
	const pageProps = usePage().props;

	const form = useForm<CreateRoomSchema>({
		mode: 'onChange',
		resolver: vineResolver(createRoomValidator),
		defaultValues: {
			name: '',
			address: '',
			capacity: 1,
		},
	});

	useEffect(() => {
		if (!('errors' in pageProps)) {
			return;
		}

		const { errors } = pageProps;
		const errorKeys = Object.keys(errors);

		for (const errorKey of errorKeys) {
			form.setError(errorKey as keyof CreateRoomSchema, { type: 'manual', message: errors[errorKey] });
		}
	}, [pageProps.errors]);

	function onSubmit(data: CreateRoomSchema) {
		router.put(route('admin.rooms.create').path, data, {
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
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Room Name</FormLabel>
										<FormControl>
											<Input required {...field} placeholder="Enter room name" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="address"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Address</FormLabel>
										<FormControl>
											<Textarea required {...field} placeholder="Enter room address" rows={3} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="capacity"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Capacity</FormLabel>
										<FormControl>
											<Input
												required
												type="number"
												min={1}
												max={100_000}
												{...field}
												onChange={(event) => field.onChange(Number.parseInt(event.target.value) || 1)}
												placeholder="Enter room capacity"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<Button type="submit" className="mt-4 w-full" disabled={disableSubmit}>
							Create Room
						</Button>
					</div>
				</fieldset>
			</form>
		</Form>
	);
}
