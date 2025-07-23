import type { HttpContext } from '@adonisjs/core/http';

import Participant from '#models/participant';

export default class PublicArtistsController {
	async render({ inertia }: HttpContext) {
		const artists = await Participant.all();
		const serializedArtists = artists.map((artist) => artist.serialize()) as {
			id: number;
			businessName: string;
			siret: string;
			email: string;
			phoneNumber: string;
			createdAt: string;
			updatedAt: string;
		}[];

		return inertia.render('public/artists', { artists: serializedArtists });
	}
}
