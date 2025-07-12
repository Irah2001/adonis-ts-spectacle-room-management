import type { HttpContext } from '@adonisjs/core/http';

export default class ArtistsController {
	async render({ inertia }: HttpContext) {
		return inertia.render('admin/artists');
	}
}
