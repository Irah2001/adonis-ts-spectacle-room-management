'use client';

import { useState } from 'react';

import { CalendarDays, Plus, Search, Ticket } from 'lucide-react';

import { AdminMenu } from '~/components/admin/menu';
import { Button } from '~/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '~/components/ui/card';
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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '~/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs';
import { cn } from '~/lib/utils';

export default function Tickets() {
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const events = [
		{
			id: 1,
			title: 'Tech Conference 2023',
			date: 'Oct 15, 2023',
			venue: 'Main Hall',
			ticketsSold: 450,
			ticketsTotal: 500,
			revenue: '$22,500',
			status: 'On Sale',
		},
		{
			id: 2,
			title: 'Music Festival',
			date: 'Oct 21, 2023',
			venue: 'Outdoor Arena',
			ticketsSold: 850,
			ticketsTotal: 1000,
			revenue: '$42,500',
			status: 'On Sale',
		},
		{
			id: 3,
			title: 'Corporate Workshop',
			date: 'Oct 28, 2023',
			venue: 'Conference Room B',
			ticketsSold: 120,
			ticketsTotal: 150,
			revenue: '$12,000',
			status: 'On Sale',
		},
		{
			id: 4,
			title: 'Art Exhibition',
			date: 'Nov 5, 2023',
			venue: 'Gallery Space',
			ticketsSold: 210,
			ticketsTotal: 300,
			revenue: '$6,300',
			status: 'On Sale',
		},
		{
			id: 5,
			title: 'Charity Gala',
			date: 'Nov 12, 2023',
			venue: 'Main Hall',
			ticketsSold: 0,
			ticketsTotal: 200,
			revenue: '$0',
			status: 'Not Started',
		},
	];

	const ticketTypes = [
		{
			id: 1,
			eventId: 1,
			name: 'General Admission',
			price: '$50.00',
			available: 50,
			sold: 450,
		},
		{
			id: 2,
			eventId: 2,
			name: 'General Admission',
			price: '$45.00',
			available: 100,
			sold: 700,
		},
		{
			id: 3,
			eventId: 2,
			name: 'VIP',
			price: '$95.00',
			available: 50,
			sold: 150,
		},
		{
			id: 4,
			eventId: 3,
			name: 'Workshop Pass',
			price: '$100.00',
			available: 30,
			sold: 120,
		},
		{
			id: 5,
			eventId: 4,
			name: 'Exhibition Entry',
			price: '$30.00',
			available: 90,
			sold: 210,
		},
	];

	const recentPurchases = [
		{
			id: 1,
			customer: 'John Smith',
			event: 'Tech Conference 2023',
			ticketType: 'General Admission',
			quantity: 2,
			total: '$100.00',
			date: 'Oct 1, 2023',
		},
		{
			id: 2,
			customer: 'Emily Johnson',
			event: 'Music Festival',
			ticketType: 'VIP',
			quantity: 1,
			total: '$95.00',
			date: 'Oct 2, 2023',
		},
		{
			id: 3,
			customer: 'Michael Brown',
			event: 'Corporate Workshop',
			ticketType: 'Workshop Pass',
			quantity: 5,
			total: '$500.00',
			date: 'Oct 3, 2023',
		},
		{
			id: 4,
			customer: 'Sarah Davis',
			event: 'Art Exhibition',
			ticketType: 'Exhibition Entry',
			quantity: 3,
			total: '$90.00',
			date: 'Oct 4, 2023',
		},
	];

	// eslint-disable-next-line unicorn/consistent-function-scoping
	function getColorByStatus(status: string) {
		switch (status) {
			case 'On Sale': {
				return 'bg-green-100 text-green-800';
			}

			case 'Not Started': {
				return 'bg-yellow-100 text-yellow-800';
			}

			case 'Ended': {
				return 'bg-gray-100 text-gray-800';
			}

			case 'Sold Out': {
				return 'bg-red-100 text-red-800';
			}

			default: {
				return 'bg-gray-100 text-gray-800';
			}
		}
	}

	return (
		<div className="grid flex-1">
			<div className="flex flex-col md:flex-row">
				<AdminMenu />
				<div className="flex-1 p-6">
					<div className="grid gap-6">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-bold tracking-tight">Ticket Sales</h1>
								<p className="text-muted-foreground">Manage ticket sales for your events.</p>
							</div>
							<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
								<DialogTrigger asChild>
									<Button>
										<Plus className="mr-2 h-4 w-4" />
										Create Ticket Type
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[425px]">
									<DialogHeader>
										<DialogTitle>Create New Ticket Type</DialogTitle>
										<DialogDescription>Enter the details for the new ticket type.</DialogDescription>
									</DialogHeader>
									<div className="grid gap-4 py-4">
										<div className="grid gap-2">
											<Label htmlFor="event">Event</Label>
											<Select>
												<SelectTrigger id="event">
													<SelectValue placeholder="Select event" />
												</SelectTrigger>
												<SelectContent>
													{events.map((event) => (
														<SelectItem key={event.id} value={event.id.toString()}>
															{event.title}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</div>
										<div className="grid gap-2">
											<Label htmlFor="ticket-name">Ticket Name</Label>
											<Input id="ticket-name" placeholder="e.g., General Admission, VIP, etc." />
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div className="grid gap-2">
												<Label htmlFor="price">Price</Label>
												<Input id="price" placeholder="0.00" />
											</div>
											<div className="grid gap-2">
												<Label htmlFor="quantity">Quantity</Label>
												<Input id="quantity" type="number" min="1" placeholder="100" />
											</div>
										</div>
										<div className="grid gap-2">
											<Label htmlFor="description">Description</Label>
											<Input id="description" placeholder="Ticket description" />
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div className="grid gap-2">
												<Label htmlFor="sale-start">Sale Start</Label>
												<Input id="sale-start" type="date" />
											</div>
											<div className="grid gap-2">
												<Label htmlFor="sale-end">Sale End</Label>
												<Input id="sale-end" type="date" />
											</div>
										</div>
									</div>
									<DialogFooter>
										<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
											Cancel
										</Button>
										<Button onClick={() => setIsDialogOpen(false)}>Create Ticket</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
						<div className="grid gap-6 md:grid-cols-3">
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
									<Ticket className="text-muted-foreground h-4 w-4" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">$83,300</div>
									<p className="text-muted-foreground text-xs">+12.5% from last month</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
									<Ticket className="text-muted-foreground h-4 w-4" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">1,630</div>
									<p className="text-muted-foreground text-xs">+8.2% from last month</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
									<CardTitle className="text-sm font-medium">Active Events</CardTitle>
									<CalendarDays className="text-muted-foreground h-4 w-4" />
								</CardHeader>
								<CardContent>
									<div className="text-2xl font-bold">4</div>
									<p className="text-muted-foreground text-xs">1 upcoming event</p>
								</CardContent>
							</Card>
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
							<Select defaultValue="all">
								<SelectTrigger className="w-[180px]">
									<SelectValue placeholder="Filter by status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Events</SelectItem>
									<SelectItem value="on-sale">On Sale</SelectItem>
									<SelectItem value="not-started">Not Started</SelectItem>
									<SelectItem value="ended">Ended</SelectItem>
									<SelectItem value="sold-out">Sold Out</SelectItem>
								</SelectContent>
							</Select>
						</div>
						<div>
							<Tabs defaultValue="events" className="w-full">
								<TabsList className="grid w-full grid-cols-3">
									<TabsTrigger value="events">Events</TabsTrigger>
									<TabsTrigger value="ticket-types">Ticket Types</TabsTrigger>
									<TabsTrigger value="recent-sales">Recent Sales</TabsTrigger>
								</TabsList>
								<TabsContent value="events" className="mt-4">
									<div className="rounded-md border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Event</TableHead>
													<TableHead>Date</TableHead>
													<TableHead>Venue</TableHead>
													<TableHead>Tickets Sold</TableHead>
													<TableHead>Revenue</TableHead>
													<TableHead>Status</TableHead>
													<TableHead>Actions</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{events.map((event) => (
													<TableRow key={event.id}>
														<TableCell className="font-medium">{event.title}</TableCell>
														<TableCell>{event.date}</TableCell>
														<TableCell>{event.venue}</TableCell>
														<TableCell>
															{event.ticketsSold}/{event.ticketsTotal}
														</TableCell>
														<TableCell>{event.revenue}</TableCell>
														<TableCell>
															<div
																className={cn(
																	'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
																	getColorByStatus(event.status),
																)}
															>
																{event.status}
															</div>
														</TableCell>
														<TableCell>
															<div className="flex items-center gap-2">
																<Button variant="ghost" size="sm">
																	View
																</Button>
																<Button variant="ghost" size="sm">
																	Edit
																</Button>
															</div>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								</TabsContent>
								<TabsContent value="ticket-types" className="mt-4">
									<div className="rounded-md border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Event</TableHead>
													<TableHead>Ticket Type</TableHead>
													<TableHead>Price</TableHead>
													<TableHead>Available</TableHead>
													<TableHead>Sold</TableHead>
													<TableHead>Actions</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{ticketTypes.map((ticket) => {
													const event = events.find((event) => event.id === ticket.eventId);

													return (
														<TableRow key={ticket.id}>
															<TableCell>{event?.title}</TableCell>
															<TableCell className="font-medium">{ticket.name}</TableCell>
															<TableCell>{ticket.price}</TableCell>
															<TableCell>{ticket.available}</TableCell>
															<TableCell>{ticket.sold}</TableCell>
															<TableCell>
																<div className="flex items-center gap-2">
																	<Button variant="ghost" size="sm">
																		Edit
																	</Button>
																	<Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
																		Disable
																	</Button>
																</div>
															</TableCell>
														</TableRow>
													);
												})}
											</TableBody>
										</Table>
									</div>
								</TabsContent>
								<TabsContent value="recent-sales" className="mt-4">
									<div className="rounded-md border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Customer</TableHead>
													<TableHead>Event</TableHead>
													<TableHead>Ticket Type</TableHead>
													<TableHead>Quantity</TableHead>
													<TableHead>Total</TableHead>
													<TableHead>Date</TableHead>
													<TableHead>Actions</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{recentPurchases.map((purchase) => (
													<TableRow key={purchase.id}>
														<TableCell className="font-medium">{purchase.customer}</TableCell>
														<TableCell>{purchase.event}</TableCell>
														<TableCell>{purchase.ticketType}</TableCell>
														<TableCell>{purchase.quantity}</TableCell>
														<TableCell>{purchase.total}</TableCell>
														<TableCell>{purchase.date}</TableCell>
														<TableCell>
															<div className="flex items-center gap-2">
																<Button variant="ghost" size="sm">
																	View
																</Button>
																<Button variant="ghost" size="sm">
																	Resend
																</Button>
															</div>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								</TabsContent>
							</Tabs>
						</div>
						<div className="rounded-lg border">
							<div className="p-4 font-medium">Purchase Tickets</div>
							<div className="border-t p-4">
								<div className="grid gap-4">
									<div className="grid gap-2">
										<Label htmlFor="purchase-event">Select Event</Label>
										<Select>
											<SelectTrigger id="purchase-event">
												<SelectValue placeholder="Select event" />
											</SelectTrigger>
											<SelectContent>
												{events.map((event) => (
													<SelectItem key={event.id} value={event.id.toString()}>
														{event.title} - {event.date}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="purchase-ticket-type">Select Ticket Type</Label>
										<Select disabled>
											<SelectTrigger id="purchase-ticket-type">
												<SelectValue placeholder="Select ticket type" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="general">General Admission - $50.00</SelectItem>
												<SelectItem value="vip">VIP - $95.00</SelectItem>
											</SelectContent>
										</Select>
									</div>
									<div className="grid grid-cols-2 gap-4">
										<div className="grid gap-2">
											<Label htmlFor="purchase-quantity">Quantity</Label>
											<Input id="purchase-quantity" type="number" min="1" defaultValue="1" disabled />
										</div>
										<div className="grid gap-2">
											<Label htmlFor="purchase-total">Total</Label>
											<Input id="purchase-total" value="$0.00" disabled />
										</div>
									</div>
									<Button disabled>Continue to Checkout</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
