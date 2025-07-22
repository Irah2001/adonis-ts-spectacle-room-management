import { useState } from 'react';

import type { InferPageProps } from '@adonisjs/inertia/types';
import { router } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';
import { Plus, Search } from 'lucide-react';

import type roomsController from '#controllers/admin/rooms-controller';

import { AdminMenu } from '~/components/admin/menu';
import { CreateRoomForm } from '~/components/forms/create-room-form';
import { EditRoomForm } from '~/components/forms/edit-room-form';
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

export default function Rooms({ rooms }: InferPageProps<roomsController, 'render'>) {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [editingRoom, setEditingRoom] = useState<(typeof rooms)[0] | null>(null);

	const handleDelete = (roomId: number) => {
		if (confirm('Are you sure you want to delete this room?')) {
			router.delete(route('admin.rooms.delete', { params: { id: roomId } }).path);
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
								<h1 className="text-2xl font-bold tracking-tight">Room Management</h1>
								<p className="text-muted-foreground">Manage rooms and venues for your events.</p>
							</div>
							<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
								<DialogTrigger asChild>
									<Button>
										<Plus className="mr-2 h-4 w-4" />
										Add Room
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[425px]">
									<DialogHeader>
										<DialogTitle>Add New Room</DialogTitle>
										<DialogDescription>Enter the details for the new room.</DialogDescription>
									</DialogHeader>
									<CreateRoomForm onSuccess={() => setIsCreateDialogOpen(false)} />
								</DialogContent>
							</Dialog>
						</div>

						<div className="flex items-center gap-4">
							<div className="relative flex-1">
								<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
								<Input
									type="search"
									placeholder="Search rooms..."
									className="bg-background w-full appearance-none pl-8"
								/>
							</div>
						</div>

						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{rooms.map((room) => (
								<Card key={room.id}>
									<CardHeader>
										<CardTitle>{room.name}</CardTitle>
										<CardDescription>Capacity: {room.capacity} people</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid gap-2">
											<div className="text-sm">
												<span className="font-medium">Address:</span> {room.address}
											</div>
											<div className="text-sm">
												<span className="font-medium">Capacity:</span> {room.capacity}
											</div>
											<div className="text-sm">
												<span className="font-medium">Created:</span>{' '}
												{room.createdAt ? new Date(room.createdAt).toLocaleDateString() : 'N/A'}
											</div>
										</div>
									</CardContent>
									<CardFooter className="flex justify-between gap-2">
										<Button variant="outline" size="sm" onClick={() => setEditingRoom(room)}>
											Edit
										</Button>
										<Button variant="destructive" size="sm" onClick={() => handleDelete(room.id)}>
											Delete
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>

						{rooms.length === 0 && (
							<div className="py-12 text-center">
								<p className="text-muted-foreground">No rooms found. Add your first room to get started.</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{editingRoom && (
				<Dialog open={!!editingRoom} onOpenChange={() => setEditingRoom(null)}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Edit Room</DialogTitle>
							<DialogDescription>Update the room information.</DialogDescription>
						</DialogHeader>
						<EditRoomForm
							room={editingRoom}
							onSuccess={() => setEditingRoom(null)}
							onCancel={() => setEditingRoom(null)}
						/>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
