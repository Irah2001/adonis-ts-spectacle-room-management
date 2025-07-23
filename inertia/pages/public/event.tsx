import { useState } from 'react';

import { Link } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';
import {
	CalendarDays,
	ChevronLeft,
	CircleDot,
	Clock,
	MapPin,
	Mic,
	Music2,
	Presentation,
	Share2,
	Theater,
	Users,
	Video,
} from 'lucide-react';

import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '~/components/ui/card';
import { Input } from '~/components/ui/input';
import { Label } from '~/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';

export default function Event({ id }: { id: string }) {
	const [ticketQuantity, setTicketQuantity] = useState(1);
	const [ticketType, setTicketType] = useState('general');
	const [selectedDateId, setSelectedDateId] = useState(1);

	const getEventTypeIcon = (type: string) => {
		switch (type) {
			case 'music': {
				return <Music2 className="mr-2 h-5 w-5" />;
			}

			case 'theater': {
				return <Theater className="mr-2 h-5 w-5" />;
			}

			case 'circus': {
				return <CircleDot className="mr-2 h-5 w-5" />;
			}

			case 'dance': {
				return <Users className="mr-2 h-5 w-5" />;
			}

			case 'one-man-show': {
				return <Mic className="mr-2 h-5 w-5" />;
			}

			case 'conference': {
				return <Presentation className="mr-2 h-5 w-5" />;
			}

			default: {
				return <Music2 className="mr-2 h-5 w-5" />;
			}
		}
	};

	const event = {
		id: Number.parseInt(id),
		title: 'Summer Rock Festival',
		image: '/placeholder.svg?height=600&width=1200',
		dates: [
			{ id: 1, date: 'Oct 15, 2023', time: '20:00 - 22:00', availableTickets: 150 },
			{ id: 2, date: 'Oct 16, 2023', time: '20:00 - 22:00', availableTickets: 200 },
			{ id: 3, date: 'Oct 17, 2023', time: '19:00 - 21:00', availableTickets: 180 },
		],
		venue: 'Main Hall',
		address: '123 Music Street, City, State 12345',
		artist: 'The Electric Waves',
		supportingActs: ['The Amplifiers', 'Sound Wave'],
		price: {
			general: 50,
			vip: 120,
			backstage: 200,
		},
		genre: 'Rock',
		type: 'music',
		isLive: true,
		description: `Join us for an unforgettable night of rock music featuring The Electric Waves and special guests. The Electric Waves are known for their energetic performances and unique sound that blends classic rock with modern influences.

This event will feature their latest album "Sonic Boom" along with fan favorites from their previous releases. Special effects, incredible lighting, and state-of-the-art sound systems will make this an immersive experience you won't want to miss.

Supporting acts include The Amplifiers and Sound Wave, two up-and-coming bands that are making waves in the rock scene.`,
		ageRestriction: '18+',
		doorOpenTime: '19:00',
		capacity: 500,
	};

	const calculateTotal = () => {
		return event.price[ticketType as keyof typeof event.price] * ticketQuantity;
	};

	return (
		<div className="flex min-h-screen w-full flex-col">
			<main className="flex-1">
				<section className="relative">
					<div className="absolute inset-0 z-10 bg-black/60" />
					<div className="h-[400px] bg-cover bg-center" style={{ backgroundImage: `url(${event.image})` }} />
					<div className="absolute inset-0 z-20 flex items-center">
						<div className="container mx-auto px-4 md:px-6">
							<Link
								href="/events"
								className="mb-4 inline-flex items-center text-sm font-medium text-white/90 hover:text-white"
							>
								<ChevronLeft className="mr-1 h-4 w-4" />
								Back to Events
							</Link>
							<div className="mb-2 flex items-center gap-2">
								<h1 className="text-3xl font-bold tracking-tight text-white md:text-5xl">{event.title}</h1>
								<Badge variant={event.isLive ? 'default' : 'secondary'} className="ml-2">
									{event.isLive ? 'Live' : 'Replay'}
								</Badge>
							</div>
							<p className="mb-4 text-xl text-white/90">Featuring {event.artist}</p>
							<div className="flex flex-wrap gap-4 text-white/90">
								<div className="flex items-center">
									<CalendarDays className="mr-2 h-5 w-5" />
									<span>
										{event.dates.length > 1
											? `${event.dates[0].date} - ${event.dates.at(-1)?.date ?? 'TBA'}`
											: event.dates[0].date}
									</span>
								</div>
								<div className="flex items-center">
									<Clock className="mr-2 h-5 w-5" />
									<span>Multiple showtimes available</span>
								</div>
								<div className="flex items-center">
									<MapPin className="mr-2 h-5 w-5" />
									<span>{event.venue}</span>
								</div>
								<div className="flex items-center">
									{getEventTypeIcon(event.type)}
									<span>{event.genre}</span>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="py-12">
					<div className="container mx-auto px-4 md:px-6">
						<div className="grid gap-8 md:grid-cols-3">
							<div className="space-y-8 md:col-span-2">
								<Card>
									<CardHeader>
										<CardTitle>Event Details</CardTitle>
										<CardDescription>
											{event.type.charAt(0).toUpperCase() + event.type.slice(1).replace('-', ' ')} • {event.genre}
										</CardDescription>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="prose max-w-none">
											<p>{event.description}</p>
										</div>

										<div className="grid gap-4 sm:grid-cols-2">
											<div>
												<h3 className="mb-2 font-semibold">Event Information</h3>
												<ul className="space-y-2 text-sm">
													<li className="flex items-start">
														<CalendarDays className="text-muted-foreground mr-2 h-5 w-5 shrink-0" />
														<div>
															<span className="font-medium">Dates:</span>
															<ul className="mt-1">
																{event.dates.map((date) => (
																	<li key={date.id} className="text-sm">
																		{date.date} • {date.time}
																	</li>
																))}
															</ul>
														</div>
													</li>
													<li className="flex items-start">
														<Clock className="text-muted-foreground mr-2 h-5 w-5 shrink-0" />
														<div>
															<div>
																<span className="font-medium">Doors Open:</span> {event.doorOpenTime}
															</div>
														</div>
													</li>
													<li className="flex items-start">
														<Users className="text-muted-foreground mr-2 h-5 w-5 shrink-0" />
														<div>
															<span className="font-medium">Age Restriction:</span> {event.ageRestriction}
														</div>
													</li>
													<li className="flex items-start">
														<Video className="text-muted-foreground mr-2 h-5 w-5 shrink-0" />
														<div>
															<span className="font-medium">Format:</span>{' '}
															{event.isLive ? 'Live Event' : 'Replay/Recording'}
														</div>
													</li>
												</ul>
											</div>

											<div>
												<h3 className="mb-2 font-semibold">Venue Information</h3>
												<ul className="space-y-2 text-sm">
													<li className="flex items-start">
														<MapPin className="text-muted-foreground mr-2 h-5 w-5 shrink-0" />
														<div>
															<div>
																<span className="font-medium">Venue:</span> {event.venue}
															</div>
															<div className="text-muted-foreground">{event.address}</div>
														</div>
													</li>
													<li className="flex items-start">
														<Users className="text-muted-foreground mr-2 h-5 w-5 shrink-0" />
														<div>
															<span className="font-medium">Capacity:</span> {event.capacity} people
														</div>
													</li>
												</ul>
											</div>
										</div>
									</CardContent>
								</Card>

								{event.type === 'music' && (
									<Card>
										<CardHeader>
											<CardTitle>Lineup</CardTitle>
											<CardDescription>Artists performing at this event</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												<div className="flex items-center gap-4">
													<div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
														<Music2 className="text-muted-foreground h-8 w-8" />
													</div>
													<div>
														<h3 className="font-semibold">{event.artist}</h3>
														<p className="text-muted-foreground text-sm">Main Act</p>
													</div>
												</div>

												{event.supportingActs.map((act, index) => (
													<div key={index} className="flex items-center gap-4">
														<div className="bg-muted flex h-12 w-12 items-center justify-center rounded-full">
															<Music2 className="text-muted-foreground h-6 w-6" />
														</div>
														<div>
															<h3 className="font-medium">{act}</h3>
															<p className="text-muted-foreground text-sm">Supporting Act</p>
														</div>
													</div>
												))}
											</div>
										</CardContent>
									</Card>
								)}

								{(event.type === 'theater' || event.type === 'dance') && (
									<Card>
										<CardHeader>
											<CardTitle>Cast & Crew</CardTitle>
											<CardDescription>The talented people behind this performance</CardDescription>
										</CardHeader>
										<CardContent>
											<div className="space-y-4">
												<div className="flex items-center gap-4">
													<div className="bg-muted flex h-16 w-16 items-center justify-center rounded-full">
														<Users className="text-muted-foreground h-8 w-8" />
													</div>
													<div>
														<h3 className="font-semibold">{event.artist}</h3>
														<p className="text-muted-foreground text-sm">Performing Company</p>
													</div>
												</div>
											</div>
										</CardContent>
									</Card>
								)}

								<Card>
									<CardHeader>
										<CardTitle>Venue Map</CardTitle>
										<CardDescription>Layout of {event.venue}</CardDescription>
									</CardHeader>
									<CardContent>
										<div className="bg-muted flex aspect-video items-center justify-center rounded-md">
											<p className="text-muted-foreground">Venue map will be displayed here</p>
										</div>
									</CardContent>
								</Card>
							</div>

							<div>
								<div className="sticky top-24">
									<Card>
										<CardHeader>
											<CardTitle>Book Tickets</CardTitle>
											<CardDescription>
												{event.dates.find((d) => d.id === selectedDateId)?.availableTickets ?? 0} tickets remaining
											</CardDescription>
										</CardHeader>
										<CardContent className="space-y-4">
											<div className="space-y-2">
												<Label htmlFor="event-date">Select Date</Label>
												<Select
													value={selectedDateId.toString()}
													onValueChange={(value) => setSelectedDateId(Number.parseInt(value))}
												>
													<SelectTrigger id="event-date">
														<SelectValue placeholder="Select date and time" />
													</SelectTrigger>
													<SelectContent>
														{event.dates.map((date) => (
															<SelectItem key={date.id} value={date.id.toString()}>
																{date.date} • {date.time} • {date.availableTickets} tickets left
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-2">
												<Label htmlFor="ticket-type">Ticket Type</Label>
												<Select value={ticketType} onValueChange={(value) => setTicketType(value)}>
													<SelectTrigger id="ticket-type">
														<SelectValue placeholder="Select ticket type" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="general">General Admission - ${event.price.general}</SelectItem>
														<SelectItem value="vip">VIP - ${event.price.vip}</SelectItem>
														<SelectItem value="backstage">Backstage Pass - ${event.price.backstage}</SelectItem>
													</SelectContent>
												</Select>
											</div>

											<div className="space-y-2">
												<Label htmlFor="quantity">Quantity</Label>
												<div className="flex items-center">
													<Button
														type="button"
														variant="outline"
														size="icon"
														onClick={() => setTicketQuantity(Math.max(1, ticketQuantity - 1))}
													>
														-
													</Button>
													<Input
														id="quantity"
														type="number"
														min="1"
														max="10"
														value={ticketQuantity}
														onChange={(eventChange) =>
															setTicketQuantity(Number.parseInt(eventChange.target.value) || 1)
														}
														className="mx-2 h-9 w-16 text-center"
													/>
													<Button
														type="button"
														variant="outline"
														size="icon"
														onClick={() => setTicketQuantity(Math.min(10, ticketQuantity + 1))}
													>
														+
													</Button>
												</div>
											</div>

											<div className="border-t pt-4">
												<div className="mb-2 flex justify-between">
													<span>Price per ticket:</span>
													<span>${event.price[ticketType as keyof typeof event.price].toFixed(2)}</span>
												</div>
												<div className="mb-2 flex justify-between">
													<span>Quantity:</span>
													<span>{ticketQuantity}</span>
												</div>
												<div className="flex justify-between text-lg font-semibold">
													<span>Total:</span>
													<span>${calculateTotal().toFixed(2)}</span>
												</div>
											</div>
										</CardContent>
										<CardFooter className="flex flex-col gap-4">
											<Button className="w-full">Proceed to Checkout</Button>
											<Button variant="outline" className="w-full">
												<Share2 className="mr-2 h-4 w-4" />
												Share Event
											</Button>
										</CardFooter>
									</Card>
								</div>
							</div>
						</div>
					</div>
				</section>

				<section className="bg-muted/30 py-12">
					<div className="container mx-auto px-4 md:px-6">
						<h2 className="mb-8 text-2xl font-bold tracking-tight">You Might Also Like</h2>
						<div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
							{[1, 2, 3, 4].map((eventId) => (
								<Card key={eventId} className="overflow-hidden">
									<div className="aspect-[3/2] w-full overflow-hidden">
										<img
											src="/placeholder.svg?height=300&width=500"
											alt="Event thumbnail"
											className="h-full w-full object-cover transition-transform hover:scale-105"
										/>
									</div>
									<CardHeader className="p-4">
										<CardTitle className="text-lg">Related Event {eventId}</CardTitle>
										<CardDescription>Artist Name</CardDescription>
									</CardHeader>
									<CardContent className="p-4 pt-0">
										<div className="space-y-2 text-sm">
											<div className="flex items-center">
												<CalendarDays className="text-muted-foreground mr-2 h-4 w-4" />
												<span>Nov {10 + eventId}, 2023</span>
											</div>
											<div className="flex items-center">
												<MapPin className="text-muted-foreground mr-2 h-4 w-4" />
												<span>Venue Name</span>
											</div>
										</div>
									</CardContent>
									<CardFooter className="p-4 pt-0">
										<Link href={route('event', { params: { id: 10 + eventId } }).path} className="w-full">
											<Button variant="outline" className="w-full">
												View Event
											</Button>
										</Link>
									</CardFooter>
								</Card>
							))}
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
