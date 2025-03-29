import type { CLIArgs } from '@japa/runner/types';

export function logBrowser() {
	return ({ cliArgs }: { cliArgs: CLIArgs }) => {
		if (cliArgs._?.[0] !== 'browser') {
			return;
		}

		const browser = cliArgs.browser as string;

		console.log(`\nRunning ${browser.charAt(0).toUpperCase() + browser.slice(1)} tests\n`);
	};
}
