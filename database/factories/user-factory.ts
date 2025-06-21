import factory from '@adonisjs/lucid/factories';
import { DateTime } from 'luxon';
import validator from 'validator';

import User from '#models/user';

export const UserFactory = factory
	.define(User, ({ faker }) => ({
		email: validator.normalizeEmail(faker.internet.email().toLowerCase()) || faker.internet.email().toLowerCase(),
		password: faker.internet.password(),
		isVerified: false,
	}))
	.state('verified', (user) => {
		user.isVerified = true;
	})
	.state('test', (user) => {
		user.email = 'test@test.fr';
		user.password = 'Test123!';
	})
	.state('deleted', (user) => {
		user.deletedAt = DateTime.now();
	})
	.build();
