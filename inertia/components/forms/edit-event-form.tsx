import type { InferPageProps } from '@adonisjs/inertia/types';
import { vineResolver } from '@hookform/resolvers/vine';
import { router } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';
import { useForm } from 'react-hook-form';

import type AdminEventsController from '#controllers/admin/events-controller';
import { NotificationType } from '#types/notification';
import { updateEventValidator, type UpdateEventSchema } from '#validators/event';

import { handleNotification } from '~/lib/handle-notification';

import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface EditEventFormProps {
	event: InferPageProps<AdminEventsController, 'render'>['events'][0];
	onSuccess?: () => void;
	onCancel?: () => void;
	rooms: InferPageProps<AdminEventsController, 'render'>['rooms'];
	participants: InferPageProps<AdminEventsController, 'render'>['participants'];
}

export function EditEventForm({ event, onSuccess, onCancel, rooms, participants }: EditEventFormProps) {
	const form = useForm<UpdateEventSchema>({
		resolver: vineResolver(updateEventValidator(false)),
		defaultValues: {
			date: event.date,
			status: event.status,
			seats: event.seats,
			description: event.description,
			isReady: event.isReady,
			price: event.price,
			roomId: event.roomId,
			participantId: event.participantId,
		},
	});

	const onSubmit = (data: UpdateEventSchema) => {
		router.patch(route('admin.events.update', { params: { id: event.id } }).path, data, {
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
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
												value={field.value ? new Date(field.value).toISOString() : ''}
												onChange={(event_) => field.onChange(event_.target.value)}
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
					<div className="flex justify-end gap-2">
						{onCancel && (
							<Button type="button" variant="outline" onClick={onCancel}>
								Cancel
							</Button>
						)}
						<Button type="submit" disabled={form.formState.isSubmitting}>
							{form.formState.isSubmitting ? 'Updating...' : 'Update Event'}
						</Button>
					</div>
				</fieldset>
			</form>
		</Form>
	);
}
