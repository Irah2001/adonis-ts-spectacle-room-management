import { useEffect } from 'react';

import { vineResolver } from '@hookform/resolvers/vine';
import { router, usePage } from '@inertiajs/react';
import { useForm } from 'react-hook-form';

import { NotificationType } from '#types/notification';
import { createEventValidator, type CreateEventSchema } from '#validators/event';

import { handleNotification } from '~/lib/handle-notification';

import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface RoomData {
	id: number;
	name: string;
}
interface ParticipantData {
	id: number;
	businessName: string;
}

export function CreateEventForm({
	onSuccess,
	rooms = [],
	participants = [],
}: {
	onSuccess?: () => void;
	rooms?: RoomData[];
	participants?: ParticipantData[];
}) {
	const pageProps = usePage().props;

	const form = useForm<CreateEventSchema>({
		mode: 'onChange',
		resolver: vineResolver(createEventValidator(false)),
		defaultValues: {
			date: new Date().toISOString(),
			status: '',
			seats: 0,
			description: '',
			isReady: false,
			price: 0,
			roomId: undefined,
			participantId: undefined,
		},
	});

	useEffect(() => {
		if (!('errors' in pageProps)) {
			return;
		}

		const { errors } = pageProps;
		const errorKeys = Object.keys(errors);

		for (const errorKey of errorKeys) {
			form.setError(errorKey as keyof CreateEventSchema, { type: 'manual', message: errors[errorKey] });
		}
	}, [pageProps.errors]);

	function onSubmit(data: CreateEventSchema) {
		const dataToSend = { ...data, date: new Date(data.date).toISOString() };

		router.put('/admin/events', dataToSend as unknown as Record<string, string>, {
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
					<div className="grid max-h-[calc(100vh-200px)] gap-4 overflow-y-auto pr-4">
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="date"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Date</FormLabel>
										<FormControl>
											<Input
												type="date"
												required
												{...field}
												value={typeof field.value === 'string' ? field.value : ''}
												onChange={(event) => field.onChange(event.target.value)}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="status"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Status</FormLabel>
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
								name="seats"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Seats</FormLabel>
										<FormControl>
											<Input type="number" required {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="description"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Description</FormLabel>
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
								name="price"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Price</FormLabel>
										<FormControl>
											<Input type="number" required {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="isReady"
								render={({ field }) => (
									<FormItem className="flex flex-row items-start space-y-0 space-x-3 rounded-md border p-4 shadow">
										<FormControl>
											<Checkbox checked={field.value} onCheckedChange={field.onChange} />
										</FormControl>
										<div className="space-y-1 leading-none">
											<FormLabel>Is Ready</FormLabel>
											<FormDescription>Check this box if the event is ready.</FormDescription>
										</div>
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="roomId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Room</FormLabel>
										<Select
											onValueChange={(value) => field.onChange(Number(value))}
											defaultValue={field.value ? String(field.value) : undefined}
											required
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a room" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{rooms.map((room) => (
													<SelectItem key={room.id} value={String(room.id)}>
														{room.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="participantId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Participant</FormLabel>
										<Select
											onValueChange={(value) => field.onChange(Number(value))}
											defaultValue={field.value ? String(field.value) : undefined}
											required
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="Select a participant" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{participants.map((participant) => (
													<SelectItem key={participant.id} value={String(participant.id)}>
														{participant.businessName}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
					<Button type="submit" className="mt-4 w-full" disabled={disableSubmit}>
						Create Event
					</Button>
				</fieldset>
			</form>
		</Form>
	);
}
