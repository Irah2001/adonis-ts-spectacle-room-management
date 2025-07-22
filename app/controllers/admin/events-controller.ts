import type { HttpContext } from '@adonisjs/core/http';
import { DateTime } from 'luxon';

import Event from '#models/event';
import Participant from '#models/participant';
import Room from '#models/room';
import { createEventValidator, updateEventValidator } from '#validators/event';

export default class EventsController {
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
			createdAt: string;
			updatedAt: string;
			room?: Room;
			participant?: Participant;
		}[];

		return inertia.render('admin/events', {
			events: serializedEvents,
			rooms: rooms.map((room) => room.serialize()),
			participants: participants.map((participant) => participant.serialize()),
		});
	}

	async create({ request, response, session }: HttpContext) {
		const data = await request.validateUsing(createEventValidator(true));

		try {
			await Event.create({ ...data, date: DateTime.fromJSDate(data.date) });

			session.flash('notification', {
				type: 'success',
				message: 'Event created successfully',
			});
		} catch {
			session.flash('notification', {
				type: 'error',
				message: 'Failed to create event',
			});
		}

		response.redirect().back();
	}

	async update({ params, request, response, session }: HttpContext) {
		const event = await Event.findOrFail(params.id);
		const data = await request.validateUsing(updateEventValidator(true));

		try {
			event.merge({ ...data, date: data.date ? DateTime.fromJSDate(data.date) : undefined });
			await event.save();

			session.flash('notification', {
				type: 'success',
				message: 'Event updated successfully',
			});
		} catch {
			session.flash('notification', {
				type: 'error',
				message: 'Failed to update event',
			});
		}

		response.redirect().back();
	}

	async delete({ params, response, session }: HttpContext) {
		const event = await Event.findOrFail(params.id);

		try {
			await event.delete();

			session.flash('notification', {
				type: 'success',
				message: 'Event deleted successfully',
			});
		} catch {
			session.flash('notification', {
				type: 'error',
				message: 'Failed to delete event',
			});
		}

		response.redirect().back();
	}
}
