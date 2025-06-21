import { BaseSeeder } from '@adonisjs/lucid/seeders';
import { Acl } from '@holoyan/adonisjs-permissions';

import User from '#models/user';
import env from '#start/env';

export default class extends BaseSeeder {
	async run() {
		await Acl.role().create({
			slug: 'super-admin',
		});

		const user = await User.create({
			email: env.get('DEFAULT_SUPER_ADMIN_EMAIL'),
			password: env.get('DEFAULT_SUPER_ADMIN_PASSWORD'),
			isVerified: true,
		});

		await Acl.model(user).assignRole('super-admin');
	}
}
