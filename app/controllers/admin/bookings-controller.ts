import type { HttpContext } from '@adonisjs/core/http';

export default class BookingsController {
	async render({ inertia }: HttpContext) {
		return inertia.render('admin/bookings');
	}
}
