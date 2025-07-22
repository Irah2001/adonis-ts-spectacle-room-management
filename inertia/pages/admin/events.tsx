import { useState } from 'react';

import type { InferPageProps } from '@adonisjs/inertia/types';
import { router } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';
import { format } from 'date-fns';
import { Plus, Search } from 'lucide-react';

import type EventsController from '#controllers/admin/events-controller';

import { AdminMenu } from '~/components/admin/menu';
import { CreateEventForm } from '~/components/forms/create-event-form';
import { EditEventForm } from '~/components/forms/edit-event-form';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';

interface RoomData {
	id: number;
	name: string;
}
interface ParticipantData {
	id: number;
	businessName: string;
}

export default function Events({
	events,
	rooms,
	participants,
}: InferPageProps<EventsController, 'render'> & { rooms: RoomData[]; participants: ParticipantData[] }) {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [editingEvent, setEditingEvent] = useState<(typeof events)[0] | null>(null);

	const handleDelete = (eventId: number) => {
		if (confirm('Are you sure you want to delete this event?')) {
			router.delete(route('admin.events.delete', { params: { id: eventId } }).path);
		}
	};

	return (
		<div className="grid flex-1">
			<div className="flex flex-col md:flex-row">
				<AdminMenu />
				<div className="flex-1 p-6">
					<div className="grid gap-6">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-bold tracking-tight">Event Management</h1>
								<p className="text-muted-foreground">Manage events for your venue.</p>
							</div>
							<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
								<DialogTrigger asChild>
									<Button>
										<Plus className="mr-2 h-4 w-4" />
										Add Event
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[425px]">
									<DialogHeader>
										<DialogTitle>Add New Event</DialogTitle>
										<DialogDescription>Enter the details for the new event.</DialogDescription>
									</DialogHeader>
									<CreateEventForm
										onSuccess={() => setIsCreateDialogOpen(false)}
										rooms={rooms}
										participants={participants}
									/>
								</DialogContent>
							</Dialog>
						</div>

						<div className="flex items-center gap-4">
							<div className="relative flex-1">
								<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
								<Input
									type="search"
									placeholder="Search events..."
									className="bg-background w-full appearance-none pl-8"
								/>
							</div>
						</div>

						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{events.map((event) => (
								<Card key={event.id}>
									<CardHeader>
										<CardTitle>{event.description}</CardTitle>
										<CardDescription>Status: {event.status}</CardDescription>
										<div className="text-sm">
											{event.isReady ? (
												<Badge variant="default" className="bg-green-500">
													Ready
												</Badge>
											) : (
												<Badge variant="destructive">Not ready</Badge>
											)}
										</div>
									</CardHeader>
									<CardContent>
										<div className="grid gap-2">
											<div className="text-sm">
												<span className="font-medium">Date:</span>{' '}
												{event.date ? format(new Date(event.date), 'PPP') : 'N/A'}
											</div>
											<div className="text-sm">
												<span className="font-medium">Seats:</span> {event.seats}
											</div>
											<div className="text-sm">
												<span className="font-medium">Price:</span> {event.price}
											</div>
											<div className="text-sm">
												<span className="font-medium">Room:</span> {event.room ? event.room.name : 'N/A'}
											</div>
											<div className="text-sm">
												<span className="font-medium">Participant:</span>{' '}
												{event.participant ? event.participant.businessName : 'N/A'}
											</div>
											<div className="text-sm">
												<span className="font-medium">Created:</span>{' '}
												{event.createdAt ? format(new Date(event.createdAt), 'PPP') : 'N/A'}
											</div>
										</div>
									</CardContent>
									<CardFooter className="flex justify-between gap-2">
										<Button variant="outline" size="sm" onClick={() => setEditingEvent(event)}>
											Edit
										</Button>
										<Button variant="destructive" size="sm" onClick={() => handleDelete(event.id)}>
											Delete
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>

						{events.length === 0 && (
							<div className="py-12 text-center">
								<p className="text-muted-foreground">No events found. Add your first event to get started.</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{editingEvent && (
				<Dialog open={!!editingEvent} onOpenChange={() => setEditingEvent(null)}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Edit Event</DialogTitle>
							<DialogDescription>Update the event information.</DialogDescription>
						</DialogHeader>
						<EditEventForm
							event={editingEvent}
							onSuccess={() => setEditingEvent(null)}
							onCancel={() => setEditingEvent(null)}
							rooms={rooms}
							participants={participants}
						/>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
