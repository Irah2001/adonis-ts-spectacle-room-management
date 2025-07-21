import vine from '@vinejs/vine';
import type { Infer } from '@vinejs/vine/types';

export const createParticipantValidator = vine.compile(
	vine.object({
		businessName: vine.string().trim().minLength(2).maxLength(255),
		siret: vine
			.string()
			.trim()
			.minLength(14)
			.maxLength(14)
			.regex(/^\d{14}$/),
		email: vine.string().trim().email().maxLength(255),
		phoneNumber: vine.string().trim().minLength(10).maxLength(20),
	}),
);
export type CreateParticipantSchema = Infer<typeof createParticipantValidator>;

export const updateParticipantValidator = vine.compile(
	vine.object({
		businessName: vine.string().trim().minLength(2).maxLength(255),
		siret: vine
			.string()
			.trim()
			.minLength(14)
			.maxLength(14)
			.regex(/^\d{14}$/),
		email: vine.string().trim().email().maxLength(255),
		phoneNumber: vine.string().trim().minLength(10).maxLength(20),
	}),
);
export type UpdateParticipantSchema = Infer<typeof updateParticipantValidator>;
