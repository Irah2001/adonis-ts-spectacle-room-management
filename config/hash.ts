import { defineConfig, drivers } from '@adonisjs/core/hash';

const hashConfig = defineConfig({
	default: 'scrypt',

	list: {
		scrypt: drivers.scrypt({
			cost: 16_384,
			blockSize: 8,
			parallelization: 1,
			maxMemory: 33_554_432,
		}),
	},
});

export default hashConfig;

/**
 * Inferring types for the list of hashers you have configured
 * in your application.
 */
declare module '@adonisjs/core/types' {
	// @ts-expect-error - We overwrite the HashersList interface to include our hash configuration
	export type HashersList = InferHashers<typeof hashConfig>;
}
