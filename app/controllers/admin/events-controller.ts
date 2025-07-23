import type { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';

import Event from '#models/event';
import Participant from '#models/participant';
import Room from '#models/room';
import { createEventValidator, updateEventValidator } from '#validators/event';

export default class AdminEventsController {
	async render({ inertia }: HttpContext) {
		const events = await Event.query().preload('room').preload('participant').orderBy('date', 'asc');
		const rooms = await Room.all();
		const participants = await Participant.all();

		const serializedEvents = events.map((event) => event.serialize()) as {
			id: number;
			date: string;
			status: string;
			seats: number;
			description: string;
			isReady: boolean;
			price: number;
			roomId: number;
			participantId: number;
			room: {
				id: number;
				name: string;
				address: string;
				capacity: number;
			};
			participant: {
				id: number;
				businessName: string;
				siret: string;
				email: string;
				phoneNumber: string;
			};
			createdAt: string;
			updatedAt: string;
		}[];
		const serializedRooms = rooms.map((room) => room.serialize()) as {
			id: number;
			name: string;
			address: string;
			capacity: number;
			createdAt: string;
			updatedAt: string;
		}[];
		const serializedParticipants = participants.map((participant) => participant.serialize()) as {
			id: number;
			businessName: string;
			siret: string;
			email: string;
			phoneNumber: string;
			createdAt: string;
			updatedAt: string;
		}[];

		return inertia.render('admin/events', {
			events: serializedEvents,
			rooms: serializedRooms,
			participants: serializedParticipants,
		});
	}

	async create({ request, response, session }: HttpContext) {
		const data = await request.validateUsing(createEventValidator(true));

		await Event.create({ ...data, date: DateTime.fromISO(data.date) });

		session.flash('notification', {
			type: 'success',
			message: 'Event created successfully',
		});

		response.redirect().back();
	}

	async update({ params, request, response, session }: HttpContext) {
		const event = await Event.findOrFail(params.id);
		const data = await request.validateUsing(updateEventValidator(true));

		event.merge({ ...data, date: data.date ? DateTime.fromISO(data.date) : undefined });
		await event.save();

		session.flash('notification', {
			type: 'success',
			message: 'Event updated successfully',
		});

		response.redirect().back();
	}

	async delete({ params, response, session }: HttpContext) {
		const event = await Event.findOrFail(params.id);

		await event.delete();

		session.flash('notification', {
			type: 'success',
			message: 'Event deleted successfully',
		});

		response.redirect().back();
	}
}
