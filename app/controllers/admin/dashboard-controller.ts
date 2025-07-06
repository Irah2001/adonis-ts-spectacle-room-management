import type { HttpContext } from '@adonisjs/core/http';

export default class DashboardController {
	async render({ inertia }: HttpContext) {
		return inertia.render('admin/dashboard');
	}
}
