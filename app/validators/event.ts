import vine from '@vinejs/vine';
import type { Infer } from '@vinejs/vine/types';

import type Participant from '#models/participant';
import type Room from '#models/room';

export const createEventValidator = (server: boolean) => {
	const roomId = vine.number();
	const participantId = vine.number();

	return vine.compile(
		vine.object({
			date: vine.string(),
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
			date: vine.string(),
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
export type UpdateEventSchema = Infer<ReturnType<typeof updateEventValidator>>;
