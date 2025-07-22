import factory from '@adonisjs/lucid/factories';

import Room from '#models/room';

export const RoomFactory = factory
	.define(Room, async ({ faker }) => ({
		name: faker.company.name() + ' ' + faker.helpers.arrayElement(['Hall', 'Theater', 'Studio', 'Auditorium', 'Arena']),
		address: faker.location.streetAddress() + ', ' + faker.location.city() + ', ' + faker.location.zipCode(),
		capacity: faker.number.int({ min: 50, max: 2000 }),
	}))
	.state('SmallVenue', (room) => {
		room.name = 'Intimate Studio';
		room.capacity = 75;
	})
	.state('MediumVenue', (room) => {
		room.name = 'City Theater';
		room.capacity = 500;
	})
	.state('LargeVenue', (room) => {
		room.name = 'Grand Arena';
		room.capacity = 2500;
	})
	.build();
