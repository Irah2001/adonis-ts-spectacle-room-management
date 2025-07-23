import type { HttpContext } from '@adonisjs/core/http';

import Participant from '#models/participant';

export default class ArtistsController {
	async index({ inertia }: HttpContext) {
		const artists = await Participant.all();
		return inertia.render('public/artists', { artists });
	}
}
