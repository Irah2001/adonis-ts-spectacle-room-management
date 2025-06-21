import string from '@adonisjs/core/helpers/string';
import { DateTime } from 'luxon';

import Token from '#models/token';
import type User from '#models/user';

export default class VerifyEmailService {
	/**
	 * Generate a new verify email token for the user
	 *
	 * @param user The user to generate the token for
	 * @returns The generated token
	 */
	async generateToken(user: User | null) {
		const token = string.generateRandom(64);

		if (!user) {
			return token;
		}

		await this.clearPreviousToken(user);

		const record = await user.related('tokens').create({
			type: 'verify-email',
			token,
			expiresAt: DateTime.now().plus({ days: 1 }),
		});

		return record.token;
	}

	/**
	 * Clear previous verify email token for a given user
	 *
	 * @param user The user to clear the previous token for
	 */
	async clearPreviousToken(user: User) {
		await user.related('verifyEmailToken').query().delete();
	}

	/**
	 * Get the user associated with a verify email token
	 *
	 * @param token The token to get the user for
	 * @returns The user associated with the token if valid
	 */
	async getUserByToken(token: string) {
		const record = await Token.query()
			.preload('user')
			.where('token', token)
			.where('type', 'verify-email')
			.where('expiresAt', '>', DateTime.now().toSQL())
			.orderBy('createdAt', 'desc')
			.first();

		return record?.user;
	}

	/**
	 * Verify if a verify email token is valid
	 *
	 * @param token The token to verify
	 * @returns True if the token is valid, false otherwise
	 */
	async verifyToken(token: string) {
		const record = await Token.query()
			.where('token', token)
			.where('type', 'verify-email')
			.where('expiresAt', '>', DateTime.now().toSQL())
			.first();

		return !!record;
	}
}
