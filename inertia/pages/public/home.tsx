import { Link } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';
import { CalendarDays, Clock, MapPin, Ticket } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';

export default function Home() {
	const featuredEvents = [
		{
			id: 1,
			title: 'Summer Rock Festival',
			image: '/placeholder.svg?height=400&width=600',
			dates: [
				{ date: 'Oct 15, 2023', time: '20:00 - 22:00' },
				{ date: 'Oct 16, 2023', time: '20:00 - 22:00' },
				{ date: 'Oct 17, 2023', time: '19:00 - 21:00' },
			],
			venue: 'Main Hall',
			artist: 'The Electric Waves',
			price: '$50.00',
			description: 'Join us for an unforgettable night of rock music featuring The Electric Waves and special guests.',
		},
		{
			id: 2,
			title: 'Jazz Night',
			image: '/placeholder.svg?height=400&width=600',
			dates: [
				{ date: 'Oct 18, 2023', time: '20:00 - 22:30' },
				{ date: 'Oct 19, 2023', time: '20:00 - 22:30' },
			],
			venue: 'Jazz Club',
			artist: 'Jazz Collective',
			price: '$35.00',
			description: 'Experience the smooth sounds of Jazz Collective in an intimate setting at our renowned Jazz Club.',
		},
		{
			id: 3,
			title: 'Electronic Dance Party',
			image: '/placeholder.svg?height=400&width=600',
			dates: [{ date: 'Oct 20, 2023', time: '22:00 - 02:00' }],
			venue: 'Club Space',
			artist: 'Electronic Dreams',
			price: '$40.00',
			description: 'Dance the night away with Electronic Dreams and their immersive audio-visual experience.',
		},
	];

	const upcomingEvents = [
		{
			id: 4,
			title: 'Acoustic Night',
			dates: [{ date: 'Oct 28, 2023', time: '19:00 - 21:00' }],
			venue: 'Lounge Bar',
			artist: 'The Electric Waves',
			price: '$30.00',
		},
		{
			id: 5,
			title: 'Pop Sensation Tour',
			dates: [
				{ date: 'Nov 5, 2023', time: '19:30 - 21:30' },
				{ date: 'Nov 6, 2023', time: '19:30 - 21:30' },
			],
			venue: 'Main Hall',
			artist: 'Sarah Williams',
			price: '$45.00',
		},
		{
			id: 6,
			title: 'Fusion Experience',
			dates: [{ date: 'Oct 25, 2023', time: '21:00 - 23:00' }],
			venue: 'Outdoor Arena',
			artist: 'Jazz Collective',
			price: '$35.00',
		},
		{
			id: 7,
			title: 'Smooth Jazz Evening',
			dates: [{ date: 'Nov 8, 2023', time: '19:00 - 21:00' }],
			venue: 'Lounge Bar',
			artist: 'Jazz Collective',
			price: '$30.00',
		},
		{
			id: 8,
			title: 'Ambient Sounds',
			dates: [{ date: 'Nov 10, 2023', time: '20:00 - 22:00' }],
			venue: 'Art Gallery',
			artist: 'Electronic Dreams',
			price: '$25.00',
		},
	];

	return (
		<div className="flex min-h-screen w-full flex-col">
			<section className="relative">
				<div className="absolute inset-0 z-10 bg-black/60" />
				<div
					className="h-[500px] bg-cover bg-center"
					style={{ backgroundImage: "url('/placeholder.svg?height=500&width=1200')" }}
				/>
				<div className="absolute inset-0 z-20 flex items-center justify-center">
					<div className="container mx-auto px-4 text-center md:px-6">
						<h1 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-5xl">
							Experience Live Music & Events
						</h1>
						<p className="mx-auto mb-8 max-w-2xl text-xl text-white/90">
							Discover upcoming shows, concerts, and events at our premier venues. Book your tickets now for
							unforgettable experiences.
						</p>
						<div className="flex flex-col justify-center gap-4 sm:flex-row">
							<Link href={route('events').path}>
								<Button size="lg">View Upcoming Events</Button>
							</Link>
							<Button size="lg" variant="secondary">
								Explore Venues
							</Button>
						</div>
					</div>
				</div>
			</section>

			<section className="bg-muted/30 py-12">
				<div className="container mx-auto px-4 md:px-6">
					<h2 className="mb-8 text-3xl font-bold tracking-tight">Featured Events</h2>
					<div className="grid gap-6 md:grid-cols-3">
						{featuredEvents.map((event) => (
							<Card key={event.id} className="overflow-hidden">
								<div className="aspect-video w-full overflow-hidden">
									<img
										src={event.image || '/placeholder.svg'}
										alt={event.title}
										className="h-full w-full object-cover transition-transform hover:scale-105"
									/>
								</div>
								<CardHeader>
									<CardTitle>{event.title}</CardTitle>
									<CardDescription>{event.artist}</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-2 text-sm">
										<div className="flex items-center">
											<CalendarDays className="text-muted-foreground mr-2 h-4 w-4" />
											<span>
												{event.dates.length > 1
													? `${event.dates[0].date} - ${event.dates.at(-1)?.date ?? 'TBA'}`
													: event.dates[0].date}
											</span>
										</div>
										<div className="flex items-center">
											<Clock className="text-muted-foreground mr-2 h-4 w-4" />
											<span>{event.dates.length > 1 ? `Multiple showtimes` : event.dates[0].time}</span>
										</div>
										<div className="flex items-center">
											<MapPin className="text-muted-foreground mr-2 h-4 w-4" />
											<span>{event.venue}</span>
										</div>
										<div className="flex items-center">
											<Ticket className="text-muted-foreground mr-2 h-4 w-4" />
											<span>From {event.price}</span>
										</div>
									</div>
									<p className="text-muted-foreground mt-4 line-clamp-3 text-sm">{event.description}</p>
								</CardContent>
								<CardFooter>
									<Link href={route('event', { params: { id: event.id } }).path} className="w-full">
										<Button variant="default" className="w-full">
											View Details
										</Button>
									</Link>
								</CardFooter>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section className="py-12">
				<div className="container mx-auto px-4 md:px-6">
					<div className="mb-8 flex items-center justify-between">
						<h2 className="text-3xl font-bold tracking-tight">Upcoming Events</h2>
						<Link href="/events">
							<Button variant="outline">View All Events</Button>
						</Link>
					</div>
					<div className="overflow-hidden rounded-lg border">
						<div className="divide-y">
							{upcomingEvents.map((event) => (
								<div
									key={event.id}
									className="hover:bg-muted/50 flex flex-col justify-between p-4 transition-colors sm:flex-row sm:items-center"
								>
									<div className="flex-1">
										<h3 className="font-semibold">{event.title}</h3>
										<p className="text-muted-foreground text-sm">{event.artist}</p>
										<div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm">
											<div className="flex items-center">
												<CalendarDays className="text-muted-foreground mr-1 h-3.5 w-3.5" />
												<span>
													{event.dates.length > 1
														? `${event.dates[0].date} - ${event.dates.at(-1)?.date ?? 'TBA'}`
														: event.dates[0].date}
												</span>
											</div>
											<div className="flex items-center">
												<Clock className="text-muted-foreground mr-1 h-3.5 w-3.5" />
												<span>{event.dates.length > 1 ? `Multiple showtimes` : event.dates[0].time}</span>
											</div>
											<div className="flex items-center">
												<MapPin className="text-muted-foreground mr-1 h-3.5 w-3.5" />
												<span>{event.venue}</span>
											</div>
										</div>
									</div>
									<div className="mt-4 flex items-center gap-4 sm:mt-0">
										<div className="text-sm font-medium">From {event.price}</div>
										<Link href={route('event', { params: { id: event.id } }).path} className="w-full">
											<Button size="sm">Book Tickets</Button>
										</Link>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</section>

			<section className="bg-muted/30 py-12">
				<div className="container mx-auto px-4 md:px-6">
					<h2 className="mb-8 text-3xl font-bold tracking-tight">Our Venues</h2>
					<div className="grid gap-6 md:grid-cols-3">
						{[
							{
								name: 'Main Hall',
								image: '/placeholder.svg?height=300&width=500',
								capacity: '500 people',
								description: 'Our largest venue perfect for concerts, conferences, and large events.',
							},
							{
								name: 'Jazz Club',
								image: '/placeholder.svg?height=300&width=500',
								capacity: '150 people',
								description: 'An intimate setting with excellent acoustics for jazz performances and small concerts.',
							},
							{
								name: 'Lounge Bar',
								image: '/placeholder.svg?height=300&width=500',
								capacity: '100 people',
								description: 'A cozy venue with a full bar, perfect for acoustic sets and small gatherings.',
							},
						].map((venue, index) => (
							<Card key={index}>
								<div className="aspect-video w-full overflow-hidden">
									<img
										src={venue.image || '/placeholder.svg'}
										alt={venue.name}
										className="h-full w-full object-cover transition-transform hover:scale-105"
									/>
								</div>
								<CardHeader>
									<CardTitle>{venue.name}</CardTitle>
									<CardDescription>Capacity: {venue.capacity}</CardDescription>
								</CardHeader>
								<CardContent>
									<p className="text-muted-foreground text-sm">{venue.description}</p>
								</CardContent>
								<CardFooter>
									<Button className="w-full">View Venue</Button>
								</CardFooter>
							</Card>
						))}
					</div>
				</div>
			</section>

			<section className="bg-primary text-primary-foreground py-12">
				<div className="container mx-auto px-4 text-center md:px-6">
					<h2 className="mb-4 text-3xl font-bold tracking-tight">Stay Updated</h2>
					<p className="mx-auto mb-8 max-w-2xl text-lg">
						Subscribe to our newsletter to get the latest updates on upcoming events, special offers, and more.
					</p>
					<div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
						<input
							type="email"
							placeholder="Enter your email"
							className="text-foreground bg-background flex-1 rounded-md px-4 py-2"
						/>
						<Button className="bg-background text-foreground hover:bg-background/90">Subscribe</Button>
					</div>
				</div>
			</section>
		</div>
	);
}
