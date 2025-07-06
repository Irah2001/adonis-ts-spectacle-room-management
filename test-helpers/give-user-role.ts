import { Acl } from '@holoyan/adonisjs-permissions';

import type User from '#models/user';

export async function giveUserRole(user: User, role: string) {
	await Acl.role().create({
		slug: role,
	});
	await Acl.model(user).assignRole(role);
}
