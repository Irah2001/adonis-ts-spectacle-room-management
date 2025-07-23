import { useState } from 'react';

import type { InferPageProps } from '@adonisjs/inertia/types';
import { router } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';
import { Plus, Search } from 'lucide-react';

import type AdminArtistsController from '#controllers/admin/artists-controller';

import { AdminMenu } from '~/components/admin/menu';
import { CreateArtistForm } from '~/components/forms/create-artist-form';
import { EditArtistForm } from '~/components/forms/edit-artist-form';
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

export default function Artists({ artists }: InferPageProps<AdminArtistsController, 'render'>) {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
	const [editingArtist, setEditingArtist] = useState<(typeof artists)[0] | null>(null);

	const handleDelete = (artistId: number) => {
		if (confirm('Are you sure you want to delete this artist?')) {
			router.delete(route('admin.artists.delete', { params: { id: artistId } }).path);
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
								<h1 className="text-2xl font-bold tracking-tight">Artist Management</h1>
								<p className="text-muted-foreground">Manage bands, artists, and groups for your events.</p>
							</div>
							<Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
								<DialogTrigger asChild>
									<Button>
										<Plus className="mr-2 h-4 w-4" />
										Add Artist
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[425px]">
									<DialogHeader>
										<DialogTitle>Add New Artist</DialogTitle>
										<DialogDescription>Enter the details for the new artist or company.</DialogDescription>
									</DialogHeader>
									<CreateArtistForm onSuccess={() => setIsCreateDialogOpen(false)} />
								</DialogContent>
							</Dialog>
						</div>

						<div className="flex items-center gap-4">
							<div className="relative flex-1">
								<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
								<Input
									type="search"
									placeholder="Search artists..."
									className="bg-background w-full appearance-none pl-8"
								/>
							</div>
						</div>

						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{artists.map((artist) => (
								<Card key={artist.id}>
									<CardHeader>
										<CardTitle>{artist.businessName}</CardTitle>
										<CardDescription>SIRET: {artist.siret}</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid gap-2">
											<div className="text-sm">
												<span className="font-medium">Email:</span> {artist.email}
											</div>
											<div className="text-sm">
												<span className="font-medium">Phone:</span> {artist.phoneNumber}
											</div>
											<div className="text-sm">
												<span className="font-medium">Created:</span>{' '}
												{artist.createdAt ? new Date(artist.createdAt).toLocaleDateString() : 'N/A'}
											</div>
										</div>
									</CardContent>
									<CardFooter className="flex justify-between gap-2">
										<Button variant="outline" size="sm" onClick={() => setEditingArtist(artist)}>
											Edit
										</Button>
										<Button variant="destructive" size="sm" onClick={() => handleDelete(artist.id)}>
											Delete
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>

						{artists.length === 0 && (
							<div className="py-12 text-center">
								<p className="text-muted-foreground">No artists found. Add your first artist to get started.</p>
							</div>
						)}
					</div>
				</div>
			</div>

			{editingArtist && (
				<Dialog open={!!editingArtist} onOpenChange={() => setEditingArtist(null)}>
					<DialogContent className="sm:max-w-[425px]">
						<DialogHeader>
							<DialogTitle>Edit Artist</DialogTitle>
							<DialogDescription>Update the artist information.</DialogDescription>
						</DialogHeader>
						<EditArtistForm
							artist={editingArtist}
							onSuccess={() => setEditingArtist(null)}
							onCancel={() => setEditingArtist(null)}
						/>
					</DialogContent>
				</Dialog>
			)}
		</div>
	);
}
