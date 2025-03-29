import string from '@adonisjs/core/helpers/string';
import { getActiveTest } from '@japa/runner';
import timekeeper from 'timekeeper';

export function timeTravel(timeToTravel: number | string) {
	const test = getActiveTest();

	if (!test) {
		throw new Error('Cannot use "timeTravel" outside of a Japa test');
	}

	timekeeper.reset();

	const date = new Date();
	const secondsToTravel = string.seconds.parse(timeToTravel);

	date.setSeconds(date.getSeconds() + secondsToTravel);

	timekeeper.travel(date);

	test.cleanup(() => {
		timekeeper.reset();
	});
}
