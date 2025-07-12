import { Link, usePage } from '@inertiajs/react';

import { cn } from '~/lib/utils';

interface AdminMenuLinkProps {
	href: string;
	children: React.ReactNode;
}

export function AdminMenuLink({ href, children }: AdminMenuLinkProps) {
	const { url } = usePage();

	return (
		<Link
			href={href}
			className={cn(
				'flex items-center gap-3 rounded-lg px-3 py-2 transition-all',
				url === href
					? 'bg-primary text-primary-foreground hover:text-primary-foreground'
					: 'text-muted-foreground hover:text-foreground',
			)}
		>
			{children}
		</Link>
	);
}
