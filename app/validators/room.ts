import vine from '@vinejs/vine';
import type { Infer } from '@vinejs/vine/types';

export const createRoomValidator = vine.compile(
	vine.object({
		name: vine.string().minLength(1).maxLength(255).trim(),
		address: vine.string().minLength(1).maxLength(500).trim(),
		capacity: vine.number().min(1).max(100_000),
	}),
);

export type CreateRoomSchema = Infer<typeof createRoomValidator>;

export const updateRoomValidator = vine.compile(
	vine.object({
		name: vine.string().minLength(1).maxLength(255).trim(),
		address: vine.string().minLength(1).maxLength(500).trim(),
		capacity: vine.number().min(1).max(100_000),
	}),
);

export type UpdateRoomSchema = Infer<typeof updateRoomValidator>;
