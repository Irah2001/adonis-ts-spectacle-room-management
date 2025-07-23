import type { HttpContext } from '@adonisjs/core/http';

export default class AdminInvoicesController {
	async render({ inertia }: HttpContext) {
		return inertia.render('admin/invoices');
	}
}
