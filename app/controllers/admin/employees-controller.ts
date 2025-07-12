import type { HttpContext } from '@adonisjs/core/http';

export default class EmployeesController {
	async render({ inertia }: HttpContext) {
		return inertia.render('admin/employees');
	}
}
