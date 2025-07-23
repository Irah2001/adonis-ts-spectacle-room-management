import type { HttpContext } from '@adonisjs/core/http';

import Employee from '#models/employee';
import type { EmployeePosition } from '#types/employee';
import { createEmployeeValidator, updateEmployeeValidator } from '#validators/employee';

export default class AdminEmployeesController {
	async render({ inertia }: HttpContext) {
		const employees = await Employee.all();
		const serializedEmployees = employees.map((employee) => employee.serialize()) as {
			id: number;
			firstName: string;
			lastName: string;
			position: EmployeePosition;
			createdAt: string;
			updatedAt: string;
		}[];

		return inertia.render('admin/employees', { employees: serializedEmployees });
	}

	async create({ request, response, session }: HttpContext) {
		const data = await request.validateUsing(createEmployeeValidator);

		try {
			await Employee.create(data);

			session.flash('notification', {
				type: 'success',
				message: 'Employee created successfully',
			});
		} catch {
			session.flash('notification', {
				type: 'error',
				message: 'Failed to create employee',
			});
		}

		response.redirect().back();
	}

	async update({ params, request, response, session }: HttpContext) {
		const employee = await Employee.findOrFail(params.id);
		const payload = await request.validateUsing(updateEmployeeValidator);

		try {
			employee.merge({
				firstName: payload.firstName,
				lastName: payload.lastName,
				position: payload.position,
			});

			await employee.save();

			session.flash('notification', {
				type: 'success',
				message: 'Employee updated successfully',
			});
		} catch {
			session.flash('notification', {
				type: 'error',
				message: 'Failed to update employee',
			});
		}

		response.redirect().back();
	}
}
