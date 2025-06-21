import { Link, usePage } from '@inertiajs/react';
import { route } from '@izzyjs/route/client';

import type User from '#models/user';

import { ThemeSwitch } from '../theme-switch';
import { navigationMenuTriggerStyle } from '../ui/navigation-menu';

export function AuthDesktop() {
	const { user } = usePage().props as unknown as { user: User | null };

	return (
		<div className="flex">
			<div className="hidden lg:flex">
				{user ? (
					<Link className={navigationMenuTriggerStyle()} href={route('logout.handle').path} method="delete" as="button">
						Logout
					</Link>
				) : (
					<>
						<Link className={navigationMenuTriggerStyle()} href={route('auth.login.render').path}>
							Login
						</Link>
						<Link className={navigationMenuTriggerStyle()} href={route('auth.register.render').path}>
							Register
						</Link>
					</>
				)}
			</div>
			<ThemeSwitch />
		</div>
	);
}
