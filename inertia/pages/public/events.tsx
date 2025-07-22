import React from 'react';

import { Link } from '@inertiajs/react';
import {
	CalendarDays,
	ChevronLeft,
	ChevronRight,
	CircleDot,
	Clock,
	Filter,
	MapPin,
	Mic,
	Music2,
	Presentation,
	Search,
	Theater,
	Ticket,
	Users,
} from 'lucide-react';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';

export default function Events() {
	const events = [
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
			genre: 'Rock',
			type: 'music',
			isLive: true,
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
			genre: 'Jazz',
			type: 'music',
			isLive: true,
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
			genre: 'Electronic',
			type: 'music',
			isLive: true,
			description: 'Dance the night away with Electronic Dreams and their immersive audio-visual experience.',
		},
		{
			id: 4,
			title: 'Romeo and Juliet',
			image: '/placeholder.svg?height=400&width=600',
			dates: [
				{ date: 'Oct 28, 2023', time: '19:00 - 21:30' },
				{ date: 'Oct 29, 2023', time: '19:00 - 21:30' },
				{ date: 'Oct 30, 2023', time: '19:00 - 21:30' },
			],
			venue: 'Theater Hall',
			artist: 'City Theater Company',
			price: '$45.00',
			genre: 'Drama',
			type: 'theater',
			isLive: true,
			description: "A modern interpretation of Shakespeare's classic tale of star-crossed lovers.",
		},
		{
			id: 5,
			title: 'Cirque Fantastique',
			image: '/placeholder.svg?height=400&width=600',
			dates: [
				{ date: 'Nov 5, 2023', time: '19:30 - 21:30' },
				{ date: 'Nov 6, 2023', time: '19:30 - 21:30' },
				{ date: 'Nov 7, 2023', time: '15:00 - 17:00' },
			],
			venue: 'Main Hall',
			artist: 'International Circus Troupe',
			price: '$55.00',
			genre: 'Family',
			type: 'circus',
			isLive: true,
			description: 'Prepare to be amazed by breathtaking acrobatics, juggling, and aerial performances.',
		},
		{
			id: 6,
			title: 'Swan Lake',
			image: '/placeholder.svg?height=400&width=600',
			dates: [{ date: 'Oct 25, 2023', time: '19:00 - 21:30' }],
			venue: 'Opera House',
			artist: 'National Ballet Company',
			price: '$65.00',
			genre: 'Classical',
			type: 'dance',
			isLive: true,
			description:
				"Experience the timeless beauty of Tchaikovsky's masterpiece performed by the National Ballet Company.",
		},
		{
			id: 7,
			title: 'Tech Conference 2023',
			image: '/placeholder.svg?height=400&width=600',
			dates: [
				{ date: 'Nov 8, 2023', time: '09:00 - 17:00' },
				{ date: 'Nov 9, 2023', time: '09:00 - 17:00' },
			],
			venue: 'Conference Center',
			artist: 'Various Speakers',
			price: '$120.00',
			genre: 'Technology',
			type: 'conference',
			isLive: true,
			description:
				'Join industry leaders and innovators for two days of talks, workshops, and networking opportunities.',
		},
		{
			id: 8,
			title: 'Comedy Special: Laugh Out Loud',
			image: '/placeholder.svg?height=400&width=600',
			dates: [{ date: 'Nov 10, 2023', time: '20:00 - 22:00' }],
			venue: 'Comedy Club',
			artist: 'Jane Doe',
			price: '$35.00',
			genre: 'Comedy',
			type: 'one-man-show',
			isLive: true,
			description: 'An evening of hilarious stand-up comedy with award-winning comedian Jane Doe.',
		},
		{
			id: 9,
			title: 'National Symphony Orchestra - Replay',
			image: '/placeholder.svg?height=400&width=600',
			dates: [{ date: 'Nov 15, 2023', time: '19:00 - 21:00' }],
			venue: 'Virtual Screening Room',
			artist: 'National Symphony Orchestra',
			price: '$15.00',
			genre: 'Classical',
			type: 'music',
			isLive: false,
			description: "A recorded performance of the National Symphony Orchestra's acclaimed spring concert.",
		},
	];

	const getEventTypeIcon = (type: string) => {
		switch (type) {
			case 'music': {
				return <Music2 className="text-muted-foreground mr-2 h-4 w-4" />;
			}

			case 'theater': {
				return <Theater className="text-muted-foreground mr-2 h-4 w-4" />;
			}

			case 'circus': {
				return <CircleDot className="text-muted-foreground mr-2 h-4 w-4" />;
			}

			case 'dance': {
				return <Users className="text-muted-foreground mr-2 h-4 w-4" />;
			}

			case 'one-man-show': {
				return <Mic className="text-muted-foreground mr-2 h-4 w-4" />;
			}

			case 'conference': {
				return <Presentation className="text-muted-foreground mr-2 h-4 w-4" />;
			}

			default: {
				return <Music2 className="text-muted-foreground mr-2 h-4 w-4" />;
			}
		}
	};

	return (
		<div className="flex min-h-screen w-full flex-col">
			<main className="flex-1">
				<section className="bg-muted/30 py-8">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
							<div>
								<h1 className="text-3xl font-bold tracking-tight">Events & Shows</h1>
								<p className="text-muted-foreground">Discover and book tickets for upcoming events</p>
							</div>
							<div className="flex items-center gap-2">
								<Link href="/public">
									<Button variant="ghost" size="sm">
										<ChevronLeft className="mr-1 h-4 w-4" />
										Back to Home
									</Button>
								</Link>
							</div>
						</div>
					</div>
				</section>

				<section className="border-b py-6">
					<div className="container px-4 md:px-6">
						<div className="flex flex-col gap-4 md:flex-row">
							<div className="relative flex-1">
								<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
								<Input
									type="search"
									placeholder="Search events, artists, or venues..."
									className="bg-background w-full appearance-none pl-8"
								/>
							</div>
							<div className="flex flex-wrap gap-2">
								<Select defaultValue="all-dates">
									<SelectTrigger className="w-[140px]">
										<SelectValue placeholder="Date" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all-dates">All Dates</SelectItem>
										<SelectItem value="today">Today</SelectItem>
										<SelectItem value="this-week">This Week</SelectItem>
										<SelectItem value="this-month">This Month</SelectItem>
										<SelectItem value="next-month">Next Month</SelectItem>
									</SelectContent>
								</Select>
								<Select defaultValue="all-venues">
									<SelectTrigger className="w-[140px]">
										<SelectValue placeholder="Venue" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all-venues">All Venues</SelectItem>
										<SelectItem value="main-hall">Main Hall</SelectItem>
										<SelectItem value="jazz-club">Jazz Club</SelectItem>
										<SelectItem value="theater-hall">Theater Hall</SelectItem>
										<SelectItem value="opera-house">Opera House</SelectItem>
										<SelectItem value="conference-center">Conference Center</SelectItem>
										<SelectItem value="comedy-club">Comedy Club</SelectItem>
										<SelectItem value="virtual">Virtual</SelectItem>
									</SelectContent>
								</Select>
								<Select defaultValue="all-types">
									<SelectTrigger className="w-[140px]">
										<SelectValue placeholder="Event Type" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all-types">All Types</SelectItem>
										<SelectItem value="music">Music</SelectItem>
										<SelectItem value="theater">Theater</SelectItem>
										<SelectItem value="circus">Circus</SelectItem>
										<SelectItem value="dance">Dance</SelectItem>
										<SelectItem value="one-man-show">One-Person Show</SelectItem>
										<SelectItem value="conference">Conference</SelectItem>
									</SelectContent>
								</Select>
								<Select defaultValue="all-formats">
									<SelectTrigger className="w-[140px]">
										<SelectValue placeholder="Format" />
									</SelectTrigger>
									<SelectContent>
										<SelectItem value="all-formats">All Formats</SelectItem>
										<SelectItem value="live">Live Events</SelectItem>
										<SelectItem value="replay">Replays</SelectItem>
									</SelectContent>
								</Select>
								<Button variant="outline" size="icon">
									<Filter className="h-4 w-4" />
									<span className="sr-only">More filters</span>
								</Button>
							</div>
						</div>
					</div>
				</section>

				<section className="py-8">
					<div className="container px-4 md:px-6">
						<Tabs defaultValue="grid" className="w-full">
							<div className="mb-6 flex items-center justify-between">
								<h2 className="text-2xl font-bold tracking-tight">All Events</h2>
								<TabsList>
									<TabsTrigger value="grid">Grid</TabsTrigger>
									<TabsTrigger value="list">List</TabsTrigger>
								</TabsList>
							</div>

							<TabsContent value="grid" className="mt-0">
								<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
									{events.map((event) => (
										<Card key={event.id} className="overflow-hidden">
											<div className="relative aspect-[3/2] w-full overflow-hidden">
												<img
													src={event.image || '/placeholder.svg'}
													alt={event.title}
													className="h-full w-full object-cover transition-transform hover:scale-105"
												/>
												<div className="absolute top-2 right-2 flex gap-2">
													<Badge variant={event.isLive ? 'default' : 'secondary'} className="text-xs">
														{event.isLive ? 'Live' : 'Replay'}
													</Badge>
													<Badge variant="outline" className="bg-background/80 text-xs">
														{event.type.charAt(0).toUpperCase() + event.type.slice(1).replace('-', ' ')}
													</Badge>
												</div>
											</div>
											<CardHeader className="p-4">
												<CardTitle className="text-lg">{event.title}</CardTitle>
												<CardDescription>{event.artist}</CardDescription>
											</CardHeader>
											<CardContent className="p-4 pt-0">
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
														{getEventTypeIcon(event.type)}
														<span>{event.genre}</span>
													</div>
													<div className="flex items-center">
														<Ticket className="text-muted-foreground mr-2 h-4 w-4" />
														<span>From {event.price}</span>
													</div>
												</div>
											</CardContent>
											<CardFooter className="p-4 pt-0">
												<Link href={`/events/${event.id.toString()}`} className="w-full">
													<Button className="w-full">Book Tickets</Button>
												</Link>
											</CardFooter>
										</Card>
									))}
								</div>
							</TabsContent>

							<TabsContent value="list" className="mt-0">
								<div className="overflow-hidden rounded-lg border">
									<div className="divide-y">
										{events.map((event) => (
											<div
												key={event.id}
												className="hover:bg-muted/50 flex flex-col p-4 transition-colors md:flex-row md:items-center"
											>
												<div className="relative mb-4 md:mr-4 md:mb-0 md:w-1/4 lg:w-1/6">
													<div className="aspect-[3/2] w-full overflow-hidden rounded-md">
														<img
															src={event.image || '/placeholder.svg'}
															alt={event.title}
															className="h-full w-full object-cover"
														/>
													</div>
													<div className="absolute top-2 right-2">
														<Badge variant={event.isLive ? 'default' : 'secondary'} className="text-xs">
															{event.isLive ? 'Live' : 'Replay'}
														</Badge>
													</div>
												</div>
												<div className="flex-1">
													<div className="flex items-center gap-2">
														<h3 className="font-semibold">{event.title}</h3>
														<Badge variant="outline" className="text-xs">
															{event.type.charAt(0).toUpperCase() + event.type.slice(1).replace('-', ' ')}
														</Badge>
													</div>
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
														<div className="flex items-center">
															{React.cloneElement(getEventTypeIcon(event.type), {
																className: 'h-3.5 w-3.5 mr-1 text-muted-foreground',
															})}
															<span>{event.genre}</span>
														</div>
													</div>
													<p className="text-muted-foreground mt-2 line-clamp-2 text-sm">{event.description}</p>
												</div>
												<div className="mt-4 flex items-center gap-4 md:mt-0 md:ml-4">
													<div className="text-sm font-medium">From {event.price}</div>
													<Link href={`/events/${event.id.toString()}`}>
														<Button size="sm">Book Tickets</Button>
													</Link>
												</div>
											</div>
										))}
									</div>
								</div>
							</TabsContent>
						</Tabs>

						<div className="mt-8 flex items-center justify-center">
							<div className="flex items-center space-x-2">
								<Button variant="outline" size="icon" disabled>
									<ChevronLeft className="h-4 w-4" />
									<span className="sr-only">Previous page</span>
								</Button>
								<Button variant="outline" size="sm" className="bg-primary text-primary-foreground">
									1
								</Button>
								<Button variant="outline" size="sm">
									2
								</Button>
								<Button variant="outline" size="sm">
									3
								</Button>
								<span>...</span>
								<Button variant="outline" size="sm">
									8
								</Button>
								<Button variant="outline" size="icon">
									<ChevronRight className="h-4 w-4" />
									<span className="sr-only">Next page</span>
								</Button>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
