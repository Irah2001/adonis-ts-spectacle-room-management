import { vineResolver } from '@hookform/resolvers/vine';
import { router } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';
import { useForm } from 'react-hook-form';

import { EMPLOYEE_POSITIONS } from '#types/employee';
import { NotificationType } from '#types/notification';
import { updateEmployeeValidator, type UpdateEmployeeSchema } from '#validators/employee';

import { handleNotification } from '~/lib/handle-notification';

import { Button } from '../ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface EditEmployeeFormProps {
	employee: {
		id: number;
		firstName: string;
		lastName: string;
		position: string;
	};
	onSuccess?: () => void;
	onCancel?: () => void;
}

export function EditEmployeeForm({ employee, onSuccess, onCancel }: EditEmployeeFormProps) {
	const form = useForm<UpdateEmployeeSchema>({
		resolver: vineResolver(updateEmployeeValidator),
		defaultValues: {
			firstName: employee.firstName,
			lastName: employee.lastName,
			position: employee.position as UpdateEmployeeSchema['position'],
		},
	});

	const onSubmit = (data: UpdateEmployeeSchema) => {
		router.patch(route('admin.employees.update', { params: { id: employee.id } }).path, data, {
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

						<div className="flex justify-end gap-2">
							{onCancel && (
								<Button type="button" variant="outline" onClick={onCancel}>
									Cancel
								</Button>
							)}
							<Button type="submit" disabled={form.formState.isSubmitting}>
								{form.formState.isSubmitting ? 'Updating...' : 'Update Employee'}
							</Button>
						</div>
					</div>
				</fieldset>
			</form>
		</Form>
	);
}
