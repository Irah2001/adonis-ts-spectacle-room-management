import type { HttpContext } from '@adonisjs/core/http';

import Event from '#models/event';

export default class PublicEventsController {
	async render({ inertia }: HttpContext) {
		const events = await Event.query().preload('room').preload('participant');
		const serializedEvents = events.map((event) => event.serialize()) as {
			id: number;
			name: string;
			description: string;
			image: string;
			startDate: string;
			endDate: string;
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
		}[];

		return inertia.render('public/events', { events: serializedEvents });
	}
}
