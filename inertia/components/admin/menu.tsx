import { route } from '@izzyjs/route/client';
import { CalendarDays, CreditCard, LayoutDashboard, Music2, Ticket, Users } from 'lucide-react';

import { AdminMenuLink } from './menu-link';

export function AdminMenu() {
	return (
		<div className="bg-muted/40 border-r md:w-64">
			<nav className="grid items-start px-4 py-4 text-sm font-medium">
				<AdminMenuLink href={route('admin.dashboard.render').path}>
					<LayoutDashboard className="h-4 w-4" />
					Dashboard
				</AdminMenuLink>
				<AdminMenuLink href="#">
					<CalendarDays className="h-4 w-4" />
					Booking Calendar
				</AdminMenuLink>
				<AdminMenuLink href="#">
					<Music2 className="h-4 w-4" />
					Artist Management
				</AdminMenuLink>
				<AdminMenuLink href="#">
					<Users className="h-4 w-4" />
					Employee Scheduling
				</AdminMenuLink>
				<AdminMenuLink href="#">
					<CreditCard className="h-4 w-4" />
					Invoice Management
				</AdminMenuLink>
				<AdminMenuLink href="#">
					<Ticket className="h-4 w-4" />
					Ticket Sales
				</AdminMenuLink>
			</nav>
		</div>
	);
}
