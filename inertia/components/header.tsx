import { AuthDesktop } from './navbar/auth-desktop';
import { NavbarDesktop } from './navbar/navbar-desktop';
import { NavbarMobile } from './navbar/navbar-mobile';

export function Header() {
	return (
		<header className="bg-card text-card-foreground fixed top-0 z-50 flex h-20 w-full shrink-0 items-center gap-4 border px-4 shadow-sm md:px-6">
			<NavbarMobile />
			<h1 className="text-2xl font-semibold">Venue Name</h1>
			<NavbarDesktop />
			<AuthDesktop />
		</header>
	);
}
