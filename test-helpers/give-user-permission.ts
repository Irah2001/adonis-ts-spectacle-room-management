import { Acl } from '@holoyan/adonisjs-permissions';

import type User from '#models/user';

export async function giveUserPermissions(user: User, permissions: string[]) {
	for (const permission of permissions) {
		await Acl.permission().create({
			slug: permission,
		});
	}

	await Acl.model(user).assignDirectAllPermissions(permissions);
}
