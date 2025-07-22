import { route } from '@izzyjs/route/client';
import { CalendarDays, CreditCard, LayoutDashboard, Theater, Ticket, Users } from 'lucide-react';

import { AdminMenuLink } from './menu-link';

export function AdminMenu() {
	return (
		<div className="bg-muted/40 border-r md:w-64">
			<nav className="grid items-start px-4 py-4 text-sm font-medium">
				<AdminMenuLink href={route('admin.dashboard.render').path}>
					<LayoutDashboard className="h-4 w-4" />
					Dashboard
				</AdminMenuLink>
				<AdminMenuLink href={route('admin.bookings.render').path}>
					<CalendarDays className="h-4 w-4" />
					Booking Calendar
				</AdminMenuLink>
				<AdminMenuLink href={route('admin.artists.render').path}>
					<Users className="h-4 w-4" />
					Artist Management
				</AdminMenuLink>
				<AdminMenuLink href={route('admin.employees.render').path}>
					<Users className="h-4 w-4" />
					Employee Scheduling
				</AdminMenuLink>
				<AdminMenuLink href={route('admin.rooms.render').path}>
					<Theater className="h-4 w-4" />
					Room Management
				</AdminMenuLink>
				<AdminMenuLink href={route('admin.invoices.render').path}>
					<CreditCard className="h-4 w-4" />
					Invoice Management
				</AdminMenuLink>
				<AdminMenuLink href={route('admin.tickets.render').path}>
					<Ticket className="h-4 w-4" />
					Ticket Sales
				</AdminMenuLink>
			</nav>
		</div>
	);
}
