import type { HttpContext } from '@adonisjs/core/http';

import Participant from '#models/participant';
import { createParticipantValidator, updateParticipantValidator } from '#validators/participant';

export default class AdminArtistsController {
	async render({ inertia }: HttpContext) {
		const artists = await Participant.query().orderBy('businessName', 'asc');
		const serializedArtists = artists.map((artist) => artist.serialize()) as {
			id: number;
			businessName: string;
			siret: string;
			email: string;
			phoneNumber: string;
			createdAt: string;
			updatedAt: string;
		}[];

		return inertia.render('admin/artists', {
			artists: serializedArtists,
		});
	}

	async create({ request, response, session }: HttpContext) {
		const data = await request.validateUsing(createParticipantValidator);

		await Participant.create(data);

		session.flash('notification', {
			type: 'success',
			message: 'Artist created successfully',
		});

		response.redirect().back();
	}

	async update({ params, request, response, session }: HttpContext) {
		const artist = await Participant.findOrFail(params.id);
		const data = await request.validateUsing(updateParticipantValidator);

		artist.merge(data);
		await artist.save();

		session.flash('notification', {
			type: 'success',
			message: 'Artist updated successfully',
		});

		response.redirect().back();
	}

	async delete({ params, response, session }: HttpContext) {
		const artist = await Participant.findOrFail(params.id);

		await artist.delete();

		session.flash('notification', {
			type: 'success',
			message: 'Artist deleted successfully',
		});

		response.redirect().back();
	}
}
