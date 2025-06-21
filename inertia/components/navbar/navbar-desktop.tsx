import { route } from '@izzyjs/route/client';

import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	navigationMenuTriggerStyle,
} from '../ui/navigation-menu';

export function NavbarDesktop() {
	return (
		<NavigationMenu id="navbar-desktop" className="mx-auto hidden lg:flex">
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuLink className={navigationMenuTriggerStyle()} href={route('home').path}>
						Home
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
						Events
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
						Venues
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
						Artists
					</NavigationMenuLink>
				</NavigationMenuItem>
				<NavigationMenuItem>
					<NavigationMenuLink className={navigationMenuTriggerStyle()} href="#">
						About Us
					</NavigationMenuLink>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}
