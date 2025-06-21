import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from './ui/button';

export function ThemeSwitch() {
	const { resolvedTheme, setTheme } = useTheme();

	function handleThemeChange() {
		setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
	}

	const Icon = resolvedTheme === 'dark' ? MoonIcon : SunIcon;

	return (
		<Button variant="ghost" size="icon" onClick={handleThemeChange}>
			<Icon className="h-6 w-6" />
			<span className="sr-only">Toggle theme</span>
		</Button>
	);
}
