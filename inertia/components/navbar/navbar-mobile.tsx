import { Link, usePage } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';
import { MenuIcon } from 'lucide-react';

import type User from '#models/user';

import { Button } from '../ui/button';
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from '../ui/navigation-menu';
import { Separator } from '../ui/separator';
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '../ui/sheet';

export function NavbarMobile() {
	const { user } = usePage().props as unknown as { user: User | null };

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="ghost" size="icon" className="lg:hidden">
					<MenuIcon className="h-6 w-6" />
					<span className="sr-only">Toggle navigation menu</span>
				</Button>
			</SheetTrigger>
			<SheetContent id="navbar-dialog-mobile" side="left">
				<div className="flex items-center gap-4">
					<span className="text-2xl font-semibold">Venue Name</span>
				</div>
				<NavigationMenu
					id="navbar-mobile"
					className="flex h-full max-w-full flex-col items-start justify-between gap-4 py-6"
				>
					<NavigationMenuList className="w-full">
						<NavigationMenuItem>
							<SheetClose asChild>
								<NavigationMenuLink href={route('home').path} className="flex items-center font-semibold">
									Home
								</NavigationMenuLink>
							</SheetClose>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<SheetClose asChild>
								<NavigationMenuLink href="/" className="flex items-center font-semibold">
									Events
								</NavigationMenuLink>
							</SheetClose>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<SheetClose asChild>
								<NavigationMenuLink href="/" className="flex items-center font-semibold">
									Venues
								</NavigationMenuLink>
							</SheetClose>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<SheetClose asChild>
								<NavigationMenuLink href="/" className="flex items-center font-semibold">
									Artists
								</NavigationMenuLink>
							</SheetClose>
						</NavigationMenuItem>
						<NavigationMenuItem>
							<SheetClose asChild>
								<NavigationMenuLink href="/" className="flex items-center font-semibold">
									About Us
								</NavigationMenuLink>
							</SheetClose>
						</NavigationMenuItem>
					</NavigationMenuList>
					<div className="w-full">
						<Separator className="my-4" />
						<div className="my-4 flex gap-4">
							{user ? (
								<SheetClose asChild>
									<Button variant="outline" asChild>
										<Link
											href={route('logout.handle').path}
											className="flex w-full items-center py-2 font-semibold"
											method="delete"
											as="button"
										>
											Logout
										</Link>
									</Button>
								</SheetClose>
							) : (
								<>
									<SheetClose asChild>
										<Button variant="outline" asChild>
											<NavigationMenuLink
												href={route('auth.login.render').path}
												className="flex w-full items-center py-2 font-semibold"
											>
												Login
											</NavigationMenuLink>
										</Button>
									</SheetClose>
									<SheetClose asChild>
										<Button variant="outline" asChild>
											<NavigationMenuLink
												href={route('auth.register.render').path}
												className="flex w-full items-center py-2 font-semibold"
											>
												Register
											</NavigationMenuLink>
										</Button>
									</SheetClose>
								</>
							)}
						</div>
					</div>
				</NavigationMenu>
			</SheetContent>
		</Sheet>
	);
}
