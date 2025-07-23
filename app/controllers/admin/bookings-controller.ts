import type { HttpContext } from '@adonisjs/core/http';

export default class AdminBookingsController {
	async render({ inertia }: HttpContext) {
		return inertia.render('admin/bookings');
	}
}
