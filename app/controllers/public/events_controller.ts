import type { HttpContext } from '@adonisjs/core/http';

import Event from '#models/event';

export default class EventsController {
	/**
	 * Display a list of all events
	 */
	async index({ inertia }: HttpContext) {
		const events = await Event.query().preload('room').preload('participant');
		return inertia.render('public/events', { events });
	}
}
