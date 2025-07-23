import { StrictMode } from 'react';

import { ThemeProvider } from 'next-themes';

import { Footer } from '~/components/footer';
import { Header } from '~/components/header';
import { Notifications } from '~/components/notifications';

export function AppLayout({ children }: { children: React.ReactNode }) {
	return (
		<StrictMode>
			<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
				<Header />
				<main className="flex min-h-dvh justify-center pt-20">{children}</main>
				<Footer />
				<Notifications />
			</ThemeProvider>
		</StrictMode>
	);
}
