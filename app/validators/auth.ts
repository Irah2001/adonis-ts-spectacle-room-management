import vine from '@vinejs/vine';
import type { Infer } from '@vinejs/vine/types';

import type User from '#models/user';
import { digitRegex, lowercaseRegex, specialCharsRegex, uppercaseRegex } from '#utils/password';

export const registerValidator = (server: boolean) => {
	const email = vine.string().email().trim().normalizeEmail();

	return vine.compile(
		vine.object({
			email: server
				? email.unique(async (database, field) => {
						const user = (await database.from('users').where('email', field).first()) as User | null;

						return !user;
					})
				: email,
			password: vine
				.string()
				.minLength(8)
				.regex(uppercaseRegex)
				.regex(lowercaseRegex)
				.regex(digitRegex)
				.regex(specialCharsRegex),
			passwordConfirmation: vine.string().sameAs('password'),
		}),
	);
};
export type RegisterSchema = Infer<ReturnType<typeof registerValidator>>;

export const loginValidator = vine.compile(
	vine.object({
		email: vine.string().email().trim().normalizeEmail(),
		password: vine.string().minLength(1),
		rememberMe: vine.boolean().optional(),
	}),
);
export type LoginSchema = Infer<typeof loginValidator>;

export const forgotPasswordValidator = vine.compile(
	vine.object({
		email: vine.string().email().trim().normalizeEmail(),
	}),
);
export type ForgotPasswordSchema = Infer<typeof forgotPasswordValidator>;

export const passwordResetValidator = vine.compile(
	vine.object({
		password: vine
			.string()
			.minLength(8)
			.regex(uppercaseRegex)
			.regex(lowercaseRegex)
			.regex(digitRegex)
			.regex(specialCharsRegex),
		passwordConfirmation: vine.string().sameAs('password'),
	}),
);
export type PasswordResetSchema = Infer<typeof passwordResetValidator>;

export const verifyEmailValidator = vine.compile(
	vine.object({
		email: vine.string().email().trim().normalizeEmail(),
	}),
);
