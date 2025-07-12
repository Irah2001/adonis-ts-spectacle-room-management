import { useState } from 'react';

import { addDays, format } from 'date-fns';
import { ClipboardList, Plus, Search } from 'lucide-react';

import { AdminMenu } from '~/components/admin/menu';
import { Button } from '~/components/ui/button';
import { Calendar } from '~/components/ui/calendar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';
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
import { Textarea } from '~/components/ui/textarea';

export default function Employees() {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [isEmployeeDialogOpen, setIsEmployeeDialogOpen] = useState(false);
	const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);

	const employees = [
		{
			id: 1,
			name: 'John Smith',
			position: 'Sound Engineer',
			email: 'john.smith@example.com',
			phone: '+1 (555) 123-4567',
			status: 'Active',
		},
		{
			id: 2,
			name: 'Emily Johnson',
			position: 'Lighting Technician',
			email: 'emily.johnson@example.com',
			phone: '+1 (555) 234-5678',
			status: 'Active',
		},
		{
			id: 3,
			name: 'Michael Brown',
			position: 'Security',
			email: 'michael.brown@example.com',
			phone: '+1 (555) 345-6789',
			status: 'Active',
		},
		{
			id: 4,
			name: 'Sarah Davis',
			position: 'Bartender',
			email: 'sarah.davis@example.com',
			phone: '+1 (555) 456-7890',
			status: 'Active',
		},
		{
			id: 5,
			name: 'David Wilson',
			position: 'Stage Manager',
			email: 'david.wilson@example.com',
			phone: '+1 (555) 567-8901',
			status: 'Active',
		},
		{
			id: 6,
			name: 'Jessica Martinez',
			position: 'Box Office',
			email: 'jessica.martinez@example.com',
			phone: '+1 (555) 678-9012',
			status: 'Active',
		},
	];

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

	const assignments = [
		{
			id: 1,
			employeeId: 1,
			eventId: 1,
			role: 'Sound Engineer',
			startTime: '08:00',
			endTime: '19:00',
			notes: 'Main stage setup and operation',
		},
		{
			id: 2,
			employeeId: 2,
			eventId: 1,
			role: 'Lighting Technician',
			startTime: '08:00',
			endTime: '19:00',
			notes: 'Main stage lighting',
		},
		{
			id: 3,
			employeeId: 3,
			eventId: 1,
			role: 'Security',
			startTime: '08:00',
			endTime: '19:00',
			notes: 'Main entrance',
		},
		{
			id: 4,
			employeeId: 4,
			eventId: 1,
			role: 'Bartender',
			startTime: '08:00',
			endTime: '19:00',
			notes: 'Main bar',
		},
		{
			id: 5,
			employeeId: 5,
			eventId: 1,
			role: 'Stage Manager',
			startTime: '07:00',
			endTime: '20:00',
			notes: 'Overall event coordination',
		},
		{
			id: 6,
			employeeId: 1,
			eventId: 2,
			role: 'Sound Engineer',
			startTime: '14:00',
			endTime: '00:00',
			notes: 'Main stage and secondary stage',
		},
		{
			id: 7,
			employeeId: 2,
			eventId: 2,
			role: 'Lighting Technician',
			startTime: '14:00',
			endTime: '00:00',
			notes: 'Main stage lighting',
		},
		{
			id: 8,
			employeeId: 3,
			eventId: 2,
			role: 'Security',
			startTime: '15:00',
			endTime: '00:00',
			notes: 'VIP area',
		},
		{
			id: 9,
			employeeId: 4,
			eventId: 2,
			role: 'Bartender',
			startTime: '15:00',
			endTime: '00:00',
			notes: 'VIP bar',
		},
		{
			id: 10,
			employeeId: 6,
			eventId: 2,
			role: 'Box Office',
			startTime: '15:00',
			endTime: '22:00',
			notes: 'Ticket sales and will-call',
		},
	];

	const selectedDateAssignments = assignments.filter((assignment) => {
		const event = events.find((event) => event.id === assignment.eventId);

		return event && date && format(event.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd');
	});

	return (
		<div className="grid flex-1">
			<div className="flex flex-col md:flex-row">
				<AdminMenu />
				<div className="flex-1 p-6">
					<div className="grid gap-6">
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-2xl font-bold tracking-tight">Employee Scheduling</h1>
								<p className="text-muted-foreground">Manage employee schedules and event assignments.</p>
							</div>
							<div className="flex gap-2">
								<Dialog open={isEmployeeDialogOpen} onOpenChange={setIsEmployeeDialogOpen}>
									<DialogTrigger asChild>
										<Button variant="outline">
											<Plus className="mr-2 h-4 w-4" />
											Add Employee
										</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>Add New Employee</DialogTitle>
											<DialogDescription>Enter the details for the new employee.</DialogDescription>
										</DialogHeader>
										<div className="grid gap-4 py-4">
											<div className="grid gap-2">
												<Label htmlFor="employee-name">Full Name</Label>
												<Input id="employee-name" placeholder="Enter employee name" />
											</div>
											<div className="grid gap-2">
												<Label htmlFor="position">Position</Label>
												<Select>
													<SelectTrigger id="position">
														<SelectValue placeholder="Select position" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="sound-engineer">Sound Engineer</SelectItem>
														<SelectItem value="lighting-technician">Lighting Technician</SelectItem>
														<SelectItem value="security">Security</SelectItem>
														<SelectItem value="bartender">Bartender</SelectItem>
														<SelectItem value="stage-manager">Stage Manager</SelectItem>
														<SelectItem value="box-office">Box Office</SelectItem>
													</SelectContent>
												</Select>
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
												<Label htmlFor="notes">Notes</Label>
												<Textarea id="notes" placeholder="Additional notes about the employee" />
											</div>
										</div>
										<DialogFooter>
											<Button variant="outline" onClick={() => setIsEmployeeDialogOpen(false)}>
												Cancel
											</Button>
											<Button onClick={() => setIsEmployeeDialogOpen(false)}>Save Employee</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>

								<Dialog open={isAssignmentDialogOpen} onOpenChange={setIsAssignmentDialogOpen}>
									<DialogTrigger asChild>
										<Button>
											<ClipboardList className="mr-2 h-4 w-4" />
											Assign to Event
										</Button>
									</DialogTrigger>
									<DialogContent className="sm:max-w-[425px]">
										<DialogHeader>
											<DialogTitle>Create New Assignment</DialogTitle>
											<DialogDescription>Assign an employee to an event.</DialogDescription>
										</DialogHeader>
										<div className="grid gap-4 py-4">
											<div className="grid gap-2">
												<Label htmlFor="employee">Employee</Label>
												<Select>
													<SelectTrigger id="employee">
														<SelectValue placeholder="Select employee" />
													</SelectTrigger>
													<SelectContent>
														{employees.map((employee) => (
															<SelectItem key={employee.id} value={employee.id.toString()}>
																{employee.name} - {employee.position}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
											<div className="grid gap-2">
												<Label htmlFor="event">Event</Label>
												<Select>
													<SelectTrigger id="event">
														<SelectValue placeholder="Select event" />
													</SelectTrigger>
													<SelectContent>
														{events.map((event) => (
															<SelectItem key={event.id} value={event.id.toString()}>
																{event.title} - {format(event.date, 'MMM d, yyyy')}
															</SelectItem>
														))}
													</SelectContent>
												</Select>
											</div>
											<div className="grid gap-2">
												<Label htmlFor="role">Role</Label>
												<Input id="role" placeholder="Role for this event" />
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
												<Label htmlFor="assignment-notes">Notes</Label>
												<Textarea id="assignment-notes" placeholder="Additional notes about the assignment" />
											</div>
										</div>
										<DialogFooter>
											<Button variant="outline" onClick={() => setIsAssignmentDialogOpen(false)}>
												Cancel
											</Button>
											<Button onClick={() => setIsAssignmentDialogOpen(false)}>Save Assignment</Button>
										</DialogFooter>
									</DialogContent>
								</Dialog>
							</div>
						</div>

						<div className="grid gap-6 md:grid-cols-[1fr_300px]">
							<Card>
								<CardHeader>
									<CardTitle>Employee Directory</CardTitle>
									<CardDescription>Manage your venue staff</CardDescription>
									<div className="mt-4 flex items-center gap-4">
										<div className="relative flex-1">
											<Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
											<Input
												type="search"
												placeholder="Search employees..."
												className="bg-background w-full appearance-none pl-8"
											/>
										</div>
										<Select defaultValue="all">
											<SelectTrigger className="w-[180px]">
												<SelectValue placeholder="Filter by position" />
											</SelectTrigger>
											<SelectContent>
												<SelectItem value="all">All Positions</SelectItem>
												<SelectItem value="sound-engineer">Sound Engineer</SelectItem>
												<SelectItem value="lighting-technician">Lighting Technician</SelectItem>
												<SelectItem value="security">Security</SelectItem>
												<SelectItem value="bartender">Bartender</SelectItem>
												<SelectItem value="stage-manager">Stage Manager</SelectItem>
												<SelectItem value="box-office">Box Office</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</CardHeader>
								<CardContent>
									<div className="rounded-md border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Name</TableHead>
													<TableHead>Position</TableHead>
													<TableHead>Contact</TableHead>
													<TableHead>Status</TableHead>
													<TableHead>Actions</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{employees.map((employee) => (
													<TableRow key={employee.id}>
														<TableCell className="font-medium">{employee.name}</TableCell>
														<TableCell>{employee.position}</TableCell>
														<TableCell>{employee.email}</TableCell>
														<TableCell>
															<div className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
																{employee.status}
															</div>
														</TableCell>
														<TableCell>
															<div className="flex items-center gap-2">
																<Button variant="ghost" size="sm">
																	Edit
																</Button>
																<Button variant="ghost" size="sm">
																	View Schedule
																</Button>
															</div>
														</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								</CardContent>
							</Card>

							<div className="flex flex-col gap-6">
								<Card>
									<CardHeader>
										<CardTitle>Schedule Calendar</CardTitle>
										<CardDescription>Select a date to view assignments</CardDescription>
									</CardHeader>
									<CardContent>
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
									</CardContent>
								</Card>
							</div>
						</div>

						<Card>
							<CardHeader>
								<CardTitle>Assignments for {date ? format(date, 'MMMM d, yyyy') : 'Selected Date'}</CardTitle>
								<CardDescription>Employee assignments for the selected date</CardDescription>
							</CardHeader>
							<CardContent>
								{selectedDateAssignments.length > 0 ? (
									<div className="rounded-md border">
										<Table>
											<TableHeader>
												<TableRow>
													<TableHead>Employee</TableHead>
													<TableHead>Event</TableHead>
													<TableHead>Role</TableHead>
													<TableHead>Time</TableHead>
													<TableHead>Actions</TableHead>
												</TableRow>
											</TableHeader>
											<TableBody>
												{selectedDateAssignments.map((assignment) => {
													const employee = employees.find((employee) => employee.id === assignment.employeeId);
													const event = events.find((event) => event.id === assignment.eventId);

													return (
														<TableRow key={assignment.id}>
															<TableCell className="font-medium">{employee?.name}</TableCell>
															<TableCell>{event?.title}</TableCell>
															<TableCell>{assignment.role}</TableCell>
															<TableCell>
																{assignment.startTime} - {assignment.endTime}
															</TableCell>
															<TableCell>
																<div className="flex items-center gap-2">
																	<Button variant="ghost" size="sm">
																		Edit
																	</Button>
																	<Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
																		Remove
																	</Button>
																</div>
															</TableCell>
														</TableRow>
													);
												})}
											</TableBody>
										</Table>
									</div>
								) : (
									<div className="text-muted-foreground flex h-[200px] items-center justify-center">
										No assignments scheduled for this date
									</div>
								)}
							</CardContent>
						</Card>

						<Card>
							<CardHeader>
								<CardTitle>Upcoming Events</CardTitle>
								<CardDescription>Events that need staff assignments</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="rounded-md border">
									<Table>
										<TableHeader>
											<TableRow>
												<TableHead>Event</TableHead>
												<TableHead>Date</TableHead>
												<TableHead>Time</TableHead>
												<TableHead>Venue</TableHead>
												<TableHead>Staff Assigned</TableHead>
												<TableHead>Actions</TableHead>
											</TableRow>
										</TableHeader>
										<TableBody>
											{events.map((event) => {
												const eventAssignments = assignments.filter((a) => a.eventId === event.id);

												return (
													<TableRow key={event.id}>
														<TableCell className="font-medium">{event.title}</TableCell>
														<TableCell>{format(event.date, 'MMM d, yyyy')}</TableCell>
														<TableCell>
															{event.startTime} - {event.endTime}
														</TableCell>
														<TableCell>{event.venue}</TableCell>
														<TableCell>{eventAssignments.length} staff</TableCell>
														<TableCell>
															<div className="flex items-center gap-2">
																<Button variant="ghost" size="sm">
																	View Assignments
																</Button>
																<Button variant="ghost" size="sm">
																	Add Staff
																</Button>
															</div>
														</TableCell>
													</TableRow>
												);
											})}
										</TableBody>
									</Table>
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}
