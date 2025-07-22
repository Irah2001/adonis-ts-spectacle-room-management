import vine from '@vinejs/vine';
import type { Infer } from '@vinejs/vine/types';

import type Participant from '#models/participant';
import type Room from '#models/room';

export const createEventValidator = (server: boolean) => {
	const roomId = vine.number();
	const participantId = vine.number();

	return vine.compile(
		vine.object({
			date: vine.string().transform((value) => {
				const date = new Date(value);
				return date;
			}),
			status: vine.string(),
			seats: vine.number().min(0),
			description: vine.string(),
			isReady: vine.boolean(),
			price: vine.number().min(0),
			roomId: server
				? roomId.exists(async (database, value) => {
						const room = (await database.from('rooms').where('id', value).first()) as Room | null;
						return !!room;
					})
				: roomId,
			participantId: server
				? participantId.exists(async (database, value) => {
						const participant = (await database.from('participants').where('id', value).first()) as Participant | null;
						return !!participant;
					})
				: participantId,
		}),
	);
};
export type CreateEventSchema = Infer<ReturnType<typeof createEventValidator>>;

export const updateEventValidator = (server: boolean) => {
	const roomId = vine.number();
	const participantId = vine.number();

	return vine.compile(
		vine.object({
			date: vine
				.string()
				.transform((value) => {
					const date = new Date(value);
					return date;
				})
				.optional(),
			status: vine.string().optional(),
			seats: vine.number().min(0).optional(),
			description: vine.string().optional(),
			isReady: vine.boolean().optional(),
			price: vine.number().min(0).optional(),
			roomId: server
				? roomId
						.exists(async (database, value) => {
							const room = (await database.from('rooms').where('id', value).first()) as Room | null;
							return !!room;
						})
						.optional()
				: roomId.optional(),
			participantId: server
				? participantId
						.exists(async (database, value) => {
							const participant = (await database
								.from('participants')
								.where('id', value)
								.first()) as Participant | null;
							return !!participant;
						})
						.optional()
				: participantId.optional(),
		}),
	);
};
export type UpdateEventSchema = Infer<ReturnType<typeof updateEventValidator>>;
