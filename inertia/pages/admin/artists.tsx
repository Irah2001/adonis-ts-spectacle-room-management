import { useState } from 'react';

import { Plus, Search } from 'lucide-react';

import { AdminMenu } from '~/components/admin/menu';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { Textarea } from '~/components/ui/textarea';

export default function Artists() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const artists = [
		{
			id: 1,
			name: 'The Electric Waves',
			genre: 'Rock / Alternative',
			email: 'contact@electricwaves.com',
			phone: '+1 (555) 123-4567',
			upcomingEvents: 2,
			pastEvents: 5,
			bio: 'The Electric Waves is a rock band known for their energetic performances and unique sound.',
		},
		{
			id: 2,
			name: 'Sarah Williams',
			genre: 'Pop / R&B',
			email: 'sarah.williams@example.com',
			phone: '+1 (555) 987-6543',
			upcomingEvents: 1,
			pastEvents: 8,
			bio: 'Sarah Williams is a solo artist with a powerful voice and emotional lyrics that connect with audiences.',
		},
		{
			id: 3,
			name: 'Jazz Collective',
			genre: 'Jazz / Fusion',
			email: 'info@jazzcollective.com',
			phone: '+1 (555) 456-7890',
			upcomingEvents: 3,
			pastEvents: 4,
			bio: 'Jazz Collective brings together talented musicians to create innovative jazz fusion performances.',
		},
		{
			id: 4,
			name: 'Electronic Dreams',
			genre: 'Electronic / Dance',
			email: 'booking@electronicdreams.com',
			phone: '+1 (555) 234-5678',
			upcomingEvents: 2,
			pastEvents: 6,
			bio: 'Electronic Dreams creates immersive electronic music experiences with stunning visuals and beats.',
		},
	];

	const artistEvents = [
		{
			id: 1,
			artistId: 1,
			title: 'Summer Rock Festival',
			date: 'Oct 15, 2023',
			time: '20:00 - 22:00',
			venue: 'Main Hall',
		},
		{
			id: 2,
			artistId: 1,
			title: 'Acoustic Night',
			date: 'Oct 28, 2023',
			time: '19:00 - 21:00',
			venue: 'Lounge Bar',
		},
		{
			id: 3,
			artistId: 2,
			title: 'Pop Sensation Tour',
			date: 'Nov 5, 2023',
			time: '19:30 - 21:30',
			venue: 'Main Hall',
		},
		{
			id: 4,
			artistId: 3,
			title: 'Jazz Night',
			date: 'Oct 18, 2023',
			time: '20:00 - 22:30',
			venue: 'Jazz Club',
		},
		{
			id: 5,
			artistId: 3,
			title: 'Fusion Experience',
			date: 'Oct 25, 2023',
			time: '21:00 - 23:00',
			venue: 'Outdoor Arena',
		},
		{
			id: 6,
			artistId: 3,
			title: 'Smooth Jazz Evening',
			date: 'Nov 8, 2023',
			time: '19:00 - 21:00',
			venue: 'Lounge Bar',
		},
		{
			id: 7,
			artistId: 4,
			title: 'Electronic Dance Party',
			date: 'Oct 20, 2023',
			time: '22:00 - 02:00',
			venue: 'Club Space',
		},
		{
			id: 8,
			artistId: 4,
			title: 'Ambient Sounds',
			date: 'Nov 10, 2023',
			time: '20:00 - 22:00',
			venue: 'Art Gallery',
		},
	];

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
							<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
								<DialogTrigger asChild>
									<Button>
										<Plus className="mr-2 h-4 w-4" />
										Add Artist
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[425px]">
									<DialogHeader>
										<DialogTitle>Add New Artist</DialogTitle>
										<DialogDescription>Enter the details for the new band, artist, or group.</DialogDescription>
									</DialogHeader>
									<div className="grid gap-4 py-4">
										<div className="grid gap-2">
											<Label htmlFor="artist-name">Name</Label>
											<Input id="artist-name" placeholder="Enter artist or band name" />
										</div>
										<div className="grid gap-2">
											<Label htmlFor="genre">Genre</Label>
											<Input id="genre" placeholder="Enter music genre" />
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div className="grid gap-2">
												<Label htmlFor="email">Email</Label>
												<Input id="email" type="email" placeholder="email@example.com" />
											</div>
											<div className="grid gap-2">
												<Label htmlFor="phone">Phone</Label>
												<Input id="phone" placeholder="+1 (555) 123-4567" />
											</div>
										</div>
										<div className="grid gap-2">
											<Label htmlFor="bio">Biography</Label>
											<Textarea id="bio" placeholder="Enter artist bio" />
										</div>
									</div>
									<DialogFooter>
										<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
											Cancel
										</Button>
										<Button onClick={() => setIsDialogOpen(false)}>Save Artist</Button>
									</DialogFooter>
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
							<Select defaultValue="all">
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Filter by genre" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Genres</SelectItem>
									<SelectItem value="rock">Rock</SelectItem>
									<SelectItem value="pop">Pop</SelectItem>
									<SelectItem value="jazz">Jazz</SelectItem>
									<SelectItem value="electronic">Electronic</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{artists.map((artist) => (
								<Card key={artist.id}>
									<CardHeader>
										<CardTitle>{artist.name}</CardTitle>
										<CardDescription>{artist.genre}</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="grid gap-2">
											<div className="text-sm">
												<span className="font-medium">Email:</span> {artist.email}
											</div>
											<div className="text-sm">
												<span className="font-medium">Phone:</span> {artist.phone}
											</div>
											<div className="text-sm">
												<span className="font-medium">Upcoming Events:</span> {artist.upcomingEvents}
											</div>
											<div className="text-sm">
												<span className="font-medium">Past Events:</span> {artist.pastEvents}
											</div>
											<div className="mt-2 text-sm">{artist.bio}</div>
										</div>
									</CardContent>
									<CardFooter className="flex justify-between">
										<Button variant="outline" size="sm">
											Edit
										</Button>
										<Button variant="outline" size="sm">
											View Schedule
										</Button>
									</CardFooter>
								</Card>
							))}
						</div>
						<div>
							<h2 className="text-xl font-bold tracking-tight">Artist Schedule</h2>
							<Tabs defaultValue="upcoming" className="mt-4">
								<TabsList>
									<TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
									<TabsTrigger value="past">Past Events</TabsTrigger>
								</TabsList>
								<TabsContent value="upcoming" className="mt-4">
									<div className="rounded-lg border">
										<div className="divide-y">
											{artistEvents.map((event) => {
												const artist = artists.find((a) => a.id === event.artistId);

												return (
													<div key={event.id} className="flex items-center justify-between p-4">
														<div>
															<div className="font-medium">{event.title}</div>
															<div className="mt-1 text-sm">Artist: {artist?.name}</div>
															<div className="text-muted-foreground mt-1 text-sm">
																{event.date} - {event.time}
															</div>
															<div className="text-muted-foreground mt-1 text-sm">{event.venue}</div>
														</div>
														<div className="flex gap-2">
															<Button variant="outline" size="sm">
																Edit
															</Button>
															<Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
																Cancel
															</Button>
														</div>
													</div>
												);
											})}
										</div>
									</div>
								</TabsContent>
								<TabsContent value="past" className="mt-4">
									<div className="rounded-lg border">
										<div className="text-muted-foreground p-4 text-center">No past events to display</div>
									</div>
								</TabsContent>
							</Tabs>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
