import { StrictMode } from 'react';

import { ThemeProvider } from 'next-themes';

import Header from '~/components/header';
import { Notifications } from '~/components/notifications';

export function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<StrictMode>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
				<Header />
				<main className="flex min-h-dvh justify-center p-4 pt-24 lg:p-8 lg:pt-28">{children}</main>
				<Notifications />
			</ThemeProvider>
		</StrictMode>
	);
}
