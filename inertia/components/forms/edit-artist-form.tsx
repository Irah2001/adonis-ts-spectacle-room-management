import { vineResolver } from '@hookform/resolvers/vine';
import { router } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';
import { useForm } from 'react-hook-form';

import { NotificationType } from '#types/notification';
import { updateParticipantValidator, type UpdateParticipantSchema } from '#validators/participant';

import { handleNotification } from '~/lib/handle-notification';

import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';

interface EditArtistFormProps {
	artist: {
		id: number;
		businessName: string;
		siret: string;
		email: string;
		phoneNumber: string;
	};
	onSuccess?: () => void;
	onCancel?: () => void;
}

export function EditArtistForm({ artist, onSuccess, onCancel }: EditArtistFormProps) {
	const form = useForm<UpdateParticipantSchema>({
		resolver: vineResolver(updateParticipantValidator),
		defaultValues: {
			businessName: artist.businessName,
			siret: artist.siret,
			email: artist.email,
			phoneNumber: artist.phoneNumber,
		},
	});

	const onSubmit = (data: UpdateParticipantSchema) => {
		router.patch(route('admin.artists.update', { params: { id: artist.id } }).path, data, {
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
					<div className="grid gap-4">
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="businessName"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Business Name</FormLabel>
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
								name="siret"
								render={({ field }) => (
									<FormItem>
										<FormLabel>SIRET Number</FormLabel>
										<FormControl>
											<Input required placeholder="14 digits" maxLength={14} {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Email</FormLabel>
										<FormControl>
											<Input type="email" required {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
						<div className="grid gap-2">
							<FormField
								control={form.control}
								name="phoneNumber"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone Number</FormLabel>
										<FormControl>
											<Input required {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex justify-end gap-2">
							{onCancel && (
								<Button type="button" variant="outline" onClick={onCancel}>
									Cancel
								</Button>
							)}
							<Button type="submit" disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? 'Updating...' : 'Update Artist'}
							</Button>
						</div>
					</div>
				</fieldset>
			</form>
		</Form>
	);
}
