import { Link } from '@inertiajs/react';
import { CalendarDays, CreditCard, LayoutDashboard, Music2, Ticket, Users } from 'lucide-react';

export function AdminMenu() {
	return (
		<div className="bg-muted/40 border-r md:w-64">
			<nav className="grid items-start px-4 py-4 text-sm font-medium">
				<Link
					href="#"
					className="bg-primary text-primary-foreground hover:text-primary-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
				>
					<LayoutDashboard className="h-4 w-4" />
					Dashboard
				</Link>
				<Link
					href="#"
					className="text-muted-foreground hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
				>
					<CalendarDays className="h-4 w-4" />
					Booking Calendar
				</Link>
				<Link
					href="#"
					className="text-muted-foreground hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
				>
					<Music2 className="h-4 w-4" />
					Artist Management
				</Link>
				<Link
					href="#"
					className="text-muted-foreground hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
				>
					<Users className="h-4 w-4" />
					Employee Scheduling
				</Link>
				<Link
					href="#"
					className="text-muted-foreground hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
				>
					<CreditCard className="h-4 w-4" />
					Invoice Management
				</Link>
				<Link
					href="#"
					className="text-muted-foreground hover:text-foreground flex items-center gap-3 rounded-lg px-3 py-2 transition-all"
				>
					<Ticket className="h-4 w-4" />
					Ticket Sales
				</Link>
			</nav>
		</div>
	);
}
