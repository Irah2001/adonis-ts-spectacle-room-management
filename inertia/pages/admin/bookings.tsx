import { useState } from 'react';

import { addDays, format } from 'date-fns';
import { CalendarIcon, Plus } from 'lucide-react';

import { AdminMenu } from '~/components/admin/menu';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
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
import { Popover, PopoverContent, PopoverTrigger } from '~/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select';
import { Textarea } from '~/components/ui/textarea';

export default function Bookings() {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const events = [
		{
			id: 1,
			title: 'Tech Conference 2023',
			date: addDays(new Date(), 2),
			startTime: '09:00',
			endTime: '18:00',
			venue: 'Main Hall',
		},
		{
			id: 2,
			title: 'Music Festival',
			date: addDays(new Date(), 8),
			startTime: '16:00',
			endTime: '23:00',
			venue: 'Outdoor Arena',
		},
		{
			id: 3,
			title: 'Corporate Workshop',
			date: addDays(new Date(), 15),
			startTime: '10:00',
			endTime: '16:00',
			venue: 'Conference Room B',
		},
		{
			id: 4,
			title: 'Art Exhibition',
			date: addDays(new Date(), 22),
			startTime: '11:00',
			endTime: '20:00',
			venue: 'Gallery Space',
		},
	];

	const selectedDateEvents = events.filter(
		(event) => date && format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'),
	);

	return (
		<div className="grid flex-1">
			<div className="flex flex-col md:flex-row">
				<AdminMenu />
				<div className="flex-1 p-6">
					<div className="grid gap-6">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-bold tracking-tight">Booking Calendar</h1>
								<p className="text-muted-foreground">Manage venue bookings and availability.</p>
							</div>
							<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
								<DialogTrigger asChild>
									<Button>
										<Plus className="mr-2 h-4 w-4" />
										New Booking
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-[425px]">
									<DialogHeader>
										<DialogTitle>Create New Booking</DialogTitle>
										<DialogDescription>Enter the details for the new event booking.</DialogDescription>
									</DialogHeader>
									<div className="grid gap-4 py-4">
										<div className="grid gap-2">
											<Label htmlFor="event-name">Event Name</Label>
											<Input id="event-name" placeholder="Enter event name" />
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div className="grid gap-2">
												<Label htmlFor="event-date">Date</Label>
												<Popover>
													<PopoverTrigger asChild>
														<Button
															variant="outline"
															className="w-full justify-start text-left font-normal"
															id="event-date"
														>
															<CalendarIcon className="mr-2 h-4 w-4" />
															{date ? format(date, 'PPP') : <span>Pick a date</span>}
														</Button>
													</PopoverTrigger>
													<PopoverContent className="w-auto p-0">
														<Calendar mode="single" selected={date} onSelect={setDate} />
													</PopoverContent>
												</Popover>
											</div>
											<div className="grid gap-2">
												<Label htmlFor="venue">Venue</Label>
												<Select>
													<SelectTrigger id="venue">
														<SelectValue placeholder="Select venue" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="main-hall">Main Hall</SelectItem>
														<SelectItem value="conference-a">Conference Room A</SelectItem>
														<SelectItem value="conference-b">Conference Room B</SelectItem>
														<SelectItem value="outdoor">Outdoor Arena</SelectItem>
														<SelectItem value="gallery">Gallery Space</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div className="grid gap-2">
												<Label htmlFor="start-time">Start Time</Label>
												<Input id="start-time" type="time" />
											</div>
											<div className="grid gap-2">
												<Label htmlFor="end-time">End Time</Label>
												<Input id="end-time" type="time" />
											</div>
										</div>
										<div className="grid gap-2">
											<Label htmlFor="description">Description</Label>
											<Textarea id="description" placeholder="Enter event description" />
										</div>
									</div>
									<DialogFooter>
										<Button variant="outline" onClick={() => setIsDialogOpen(false)}>
											Cancel
										</Button>
										<Button onClick={() => setIsDialogOpen(false)}>Save Booking</Button>
									</DialogFooter>
								</DialogContent>
							</Dialog>
						</div>
						<div className="grid gap-6 md:grid-cols-[1fr_300px]">
							<div className="bg-card rounded-lg border p-4">
								<Calendar
									mode="single"
									selected={date}
									onSelect={setDate}
									className="mx-auto"
									classNames={{
										day_today: 'bg-muted text-muted-foreground',
										day_selected: 'bg-primary text-primary-foreground',
									}}
								/>
							</div>
							<div className="bg-card rounded-lg border">
								<div className="p-4 font-medium">Events on {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}</div>
								<div className="border-t">
									{selectedDateEvents.length > 0 ? (
										<div className="divide-y">
											{selectedDateEvents.map((event) => (
												<div key={event.id} className="p-4">
													<div className="font-medium">{event.title}</div>
													<div className="text-muted-foreground mt-1 text-sm">
														{event.startTime} - {event.endTime}
													</div>
													<div className="text-muted-foreground mt-1 text-sm">{event.venue}</div>
													<div className="mt-2 flex gap-2">
														<Button variant="outline" size="sm">
															Edit
														</Button>
														<Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
															Cancel
														</Button>
													</div>
												</div>
											))}
										</div>
									) : (
										<div className="text-muted-foreground flex h-[200px] items-center justify-center">
											No events scheduled for this date
										</div>
									)}
								</div>
							</div>
						</div>
						<div className="rounded-lg border">
							<div className="p-4 font-medium">Upcoming Bookings</div>
							<div className="border-t">
								<div className="divide-y">
									{events.map((event) => (
										<div key={event.id} className="flex items-center justify-between p-4">
											<div>
												<div className="font-medium">{event.title}</div>
												<div className="text-muted-foreground mt-1 text-sm">
													{format(event.date, 'MMMM d, yyyy')} • {event.startTime} - {event.endTime}
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
									))}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
