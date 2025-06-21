import string from '@adonisjs/core/helpers/string';
import { DateTime } from 'luxon';

import Token from '#models/token';
import type User from '#models/user';

export default class PasswordResetService {
	/**
	 * Generate a new password reset token for the user
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
			type: 'password-reset',
			token,
			expiresAt: DateTime.now().plus({ hours: 1 }),
		});

		return record.token;
	}

	/**
	 * Clear previous password reset token for a given user
	 *
	 * @param user The user to clear the previous token for
	 */
	async clearPreviousToken(user: User) {
		await user.related('passwordResetToken').query().delete();
	}

	/**
	 * Get the user associated with a password reset token
	 *
	 * @param token The token to get the user for
	 * @returns The user associated with the token if valid
	 */
	async getUserByToken(token: string) {
		const record = await Token.query()
			.preload('user')
			.where('token', token)
			.where('type', 'password-reset')
			.where('expiresAt', '>', DateTime.now().toSQL())
			.orderBy('createdAt', 'desc')
			.first();

		return record?.user;
	}

	/**
	 * Verify if a password reset token is valid
	 *
	 * @param token The token to verify
	 * @returns True if the token is valid, false otherwise
	 */
	async verifyToken(token: string) {
		const record = await Token.query()
			.where('token', token)
			.where('type', 'password-reset')
			.where('expiresAt', '>', DateTime.now().toSQL())
			.first();

		return !!record;
	}
}
