import factory from '@adonisjs/lucid/factories';
import { DateTime } from 'luxon';

import Event from '#models/event';

import { ParticipantFactory } from './participant-factory.js';
import { RoomFactory } from './room-factory.js';

export const EventFactory = factory
	.define(Event, async ({ faker }) => {
		return {
			date: DateTime.fromJSDate(faker.date.future()),
			status: faker.helpers.arrayElement(['planned', 'confirmed', 'in_progress', 'completed', 'cancelled']),
			seats: faker.number.int({ min: 50, max: 500 }),
			description: faker.lorem.paragraph(2),
			isReady: faker.datatype.boolean(),
			price: faker.number.float({ min: 10, max: 150, fractionDigits: 2 }),
		};
	})
	.state('upcoming', (event) => {
		event.date = DateTime.now().plus({ days: 7 });
		event.status = 'confirmed';
		event.isReady = true;
	})
	.state('past', (event) => {
		event.date = DateTime.now().minus({ days: 7 });
		event.status = 'completed';
		event.isReady = true;
	})
	.state('cancelled', (event) => {
		event.status = 'cancelled';
		event.isReady = false;
	})
	.state('cheap', (event) => {
		event.price = 15;
	})
	.state('expensive', (event) => {
		event.price = 120;
	})
	.relation('participant', () => ParticipantFactory)
	.relation('room', () => RoomFactory)
	.build();
