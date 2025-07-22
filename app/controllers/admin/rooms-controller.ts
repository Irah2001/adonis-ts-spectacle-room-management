import type { HttpContext } from '@adonisjs/core/http';

import Room from '#models/room';
import { createRoomValidator, updateRoomValidator } from '#validators/room';

export default class RoomsController {
	async render({ inertia }: HttpContext) {
		const rooms = await Room.all();
		const serializedRooms = rooms.map((room) => room.serialize()) as {
			id: number;
			name: string;
			address: string;
			capacity: number;
			createdAt: string;
			updatedAt: string;
		}[];

		return inertia.render('admin/rooms', { rooms: serializedRooms });
	}

	async create({ request, response, session }: HttpContext) {
		const data = await request.validateUsing(createRoomValidator);

		try {
			await Room.create(data);

			session.flash('notification', {
				type: 'success',
				message: 'Room created successfully',
			});
		} catch {
			session.flash('notification', {
				type: 'error',
				message: 'Failed to create room',
			});
		}

		response.redirect().back();
	}

	async update({ params, request, response, session }: HttpContext) {
		const room = await Room.findOrFail(params.id);
		const payload = await request.validateUsing(updateRoomValidator);

		try {
			room.merge({
				name: payload.name,
				address: payload.address,
				capacity: payload.capacity,
			});

			await room.save();

			session.flash('notification', {
				type: 'success',
				message: 'Room updated successfully',
			});
		} catch {
			session.flash('notification', {
				type: 'error',
				message: 'Failed to update room',
			});
		}

		response.redirect().back();
	}

	async delete({ params, response, session }: HttpContext) {
		const room = await Room.findOrFail(params.id);
		await room.delete();

		session.flash('notification', {
			type: 'success',
			message: 'Room deleted successfully',
		});

		response.redirect().back();
	}
}
