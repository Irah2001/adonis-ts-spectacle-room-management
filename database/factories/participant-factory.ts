import factory from '@adonisjs/lucid/factories';

import Participant from '#models/participant';

export const ParticipantFactory = factory
	.define(Participant, async ({ faker }) => ({
		businessName: faker.company.name(),
		siret: faker.string.numeric(14),
		email: faker.internet.email(),
		phoneNumber: faker.phone.number(),
	}))
	.state('MusicBand', (participant) => {
		participant.businessName = 'The Rock Stars';
		participant.email = 'contact@therockstars.com';
	})
	.state('TheatreCompany', (participant) => {
		participant.businessName = 'Drama Theatre Company';
		participant.email = 'info@dramatheatre.com';
	})
	.state('SoloArtist', (participant) => {
		participant.businessName = 'John Doe Solo';
		participant.email = 'john.doe@artist.com';
	})
	.build();
