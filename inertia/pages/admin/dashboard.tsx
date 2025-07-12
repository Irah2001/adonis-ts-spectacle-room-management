import { useMemo } from 'react';

import { CalendarDays, DollarSign, Music2, Ticket } from 'lucide-react';

import { AdminDashboardStat } from '~/components/admin/dashboard/stat';
import { AdminMenu } from '~/components/admin/menu';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '~/components/ui/card';

function getStatusColor(status: string) {
	switch (status) {
		case 'Paid': {
			return 'text-green-500';
		}

		case 'Pending': {
			return 'text-yellow-500';
		}

		case 'Overdue': {
			return 'text-red-500';
		}

		default: {
			return 'text-muted-foreground';
		}
	}
}

export default function Dashboard() {
	const events = useMemo(
		() => [
			{
				name: 'Tech Conference 2023',
				date: 'Oct 15, 2023',
				tickets: '450/500 sold',
				revenue: '$22,500',
			},
			{
				name: 'Music Festival',
				date: 'Oct 21, 2023',
				tickets: '850/1000 sold',
				revenue: '$42,500',
			},
			{
				name: 'Corporate Workshop',
				date: 'Oct 28, 2023',
				tickets: '120/150 sold',
				revenue: '$12,000',
			},
			{
				name: 'Art Exhibition',
				date: 'Nov 5, 2023',
				tickets: '210/300 sold',
				revenue: '$6,300',
			},
		],
		[],
	);
	const invoices = useMemo(
		() => [
			{
				id: 'INV-001',
				client: 'Acme Inc.',
				amount: '$1,200.00',
				status: 'Paid',
			},
			{
				id: 'INV-002',
				client: 'Globex Corp',
				amount: '$4,500.00',
				status: 'Pending',
			},
			{
				id: 'INV-003',
				client: 'Stark Industries',
				amount: '$3,800.00',
				status: 'Paid',
			},
			{
				id: 'INV-004',
				client: 'Wayne Enterprises',
				amount: '$2,300.00',
				status: 'Overdue',
			},
		],
		[],
	);

	return (
		<div className="grid flex-1">
			<div className="flex flex-col md:flex-row">
				<AdminMenu />
				<div className="flex-1 p-6">
					<div className="grid gap-6">
						<div>
							<h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
							<p className="text-muted-foreground">Overview of your venue management system.</p>
						</div>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
							<AdminDashboardStat
								title="Total Revenue"
								value="$45,231.89"
								Icon={DollarSign}
								description="+20.1% from last month"
							/>
							<AdminDashboardStat
								title="Upcoming Events"
								value="12"
								Icon={CalendarDays}
								description="3 events this week"
							/>
							<AdminDashboardStat title="Tickets Sold" value="2,350" Icon={Ticket} description="+15% from last month" />
							<AdminDashboardStat title="Active Artists" value="24" Icon={Music2} description="5 new this month" />
						</div>
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
							<Card className="col-span-4">
								<CardHeader>
									<CardTitle>Upcoming Events</CardTitle>
									<CardDescription>Overview of the next events at your venue.</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{events.map((event, index) => (
											<div key={index} className="flex items-center justify-between rounded-lg border p-4">
												<div className="grid gap-1">
													<p className="font-medium">{event.name}</p>
													<p className="text-muted-foreground text-sm">{event.date}</p>
												</div>
												<div className="grid gap-1 text-right">
													<p className="font-medium">{event.revenue}</p>
													<p className="text-muted-foreground text-sm">{event.tickets}</p>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
							<Card className="col-span-3">
								<CardHeader>
									<CardTitle>Recent Invoices</CardTitle>
									<CardDescription>Recent financial transactions.</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="space-y-4">
										{invoices.map((invoice, index) => (
											<div key={index} className="flex items-center justify-between rounded-lg border p-4">
												<div className="grid gap-1">
													<p className="font-medium">{invoice.id}</p>
													<p className="text-muted-foreground text-sm">{invoice.client}</p>
												</div>
												<div className="grid gap-1 text-right">
													<p className="font-medium">{invoice.amount}</p>
													<p className={`text-sm ${getStatusColor(invoice.status)}`}>{invoice.status}</p>
												</div>
											</div>
										))}
									</div>
								</CardContent>
							</Card>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
