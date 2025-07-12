import type { HttpContext } from '@adonisjs/core/http';

export default class TicketsController {
	async render({ inertia }: HttpContext) {
		return inertia.render('admin/tickets');
	}
}
