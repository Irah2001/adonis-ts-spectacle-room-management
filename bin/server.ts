/*
|--------------------------------------------------------------------------
| HTTP server entrypoint
|--------------------------------------------------------------------------
|
| The "server.ts" file is the entrypoint for starting the AdonisJS HTTP
| server. Either you can run this file directly or use the "serve"
| command to run this file and monitor file changes
|
*/

import 'reflect-metadata';

import { Ignitor, prettyPrintError } from '@adonisjs/core';

/**
 * URL to the application root. AdonisJS need it to resolve
 * paths to file and directories for scaffolding commands
 */
const APP_ROOT = new URL('../', import.meta.url);

/**
 * The importer is used to import files in context of the
 * application.
 */
function importer(filePath: string) {
	if (filePath.startsWith('./') || filePath.startsWith('../')) {
		return import(new URL(filePath, APP_ROOT).href);
	}

	return import(filePath);
}

try {
	await new Ignitor(APP_ROOT, { importer })
		.tap((app) => {
			app.booting(async () => {
				await import('#start/env');
			});
			app.listen('SIGTERM', () => {
				void app.terminate();
			});
			app.listenIf(app.managedByPm2, 'SIGINT', () => {
				void app.terminate();
			});
		})
		.httpServer()
		.start();
} catch (error) {
	process.exitCode = 1;

	void prettyPrintError(error);
}
