import hash from '@adonisjs/core/services/hash';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import { EmployeeFactory } from '#database/factories/employee-factory';
import { UserFactory } from '#database/factories/user-factory';
import Employee from '#models/employee';
import { giveUserPermissions } from '#test-helpers/give-user-permission';
import { NotificationType } from '#types/notification';

test.group('Admin employees', (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test('GET /admin/employees without logged user redirects to login', async ({ client, route }) => {
		const response = await client.get(route('admin.employees.render')).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('auth.login.render'));
	});

	test('GET /admin/employees with logged user but without permission redirects to home', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		const response = await client.get(route('admin.employees.render')).loginAs(user).withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});

	test('GET /admin/employees with logged user and permission renders employees page', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.employees.view']);

		// Create some test employees
		const employees = await EmployeeFactory.createMany(3);

		const response = await client.get(route('admin.employees.render')).loginAs(user).withInertia();

		response.assertStatus(200);
		response.assertInertiaComponent('admin/employees');
		response.assertInertiaPropsContains({
			employees: employees.map((employee) => ({
				id: employee.id,
				firstName: employee.firstName,
				lastName: employee.lastName,
				position: employee.position,
				createdAt: employee.createdAt.toISO(),
				updatedAt: employee.updatedAt.toISO(),
			})),
		});

		hash.restore();
	});

	test('PUT /admin/employees with empty body returns validation errors', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.employees.create']);

		const response = await client
			.put(route('admin.employees.create'))
			.header('referrer', route('admin.employees.render'))
			.json({})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('errors', {
			firstName: ['The firstName field must be defined'],
			lastName: ['The lastName field must be defined'],
			position: ['The position field must be defined'],
		});

		hash.restore();
	});

	test('PUT /admin/employees with invalid body returns validation errors', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.employees.create']);

		const response = await client
			.put(route('admin.employees.create'))
			.header('referrer', route('admin.employees.render'))
			.json({
				firstName: '',
				lastName: '',
				position: 'Invalid Position',
			})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('errors', {
			firstName: ['The firstName field must be defined'],
			lastName: ['The lastName field must be defined'],
			position: ['The selected position is invalid'],
		});

		hash.restore();
	});

	test('PUT /admin/employees with valid body creates employee and shows success notification', async ({
		assert,
		client,
		route,
	}) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.employees.create']);

		const employeesBefore = await Employee.all();

		const response = await client
			.put(route('admin.employees.create'))
			.header('referrer', route('admin.employees.render'))
			.json({
				firstName: 'John',
				lastName: 'Doe',
				position: 'Sound Engineer',
			})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('notification', {
			type: NotificationType.Success,
			message: 'Employee created successfully',
		});

		const employeesAfter = await Employee.all();
		assert.equal(employeesAfter.length, employeesBefore.length + 1);

		const createdEmployee = await Employee.findBy('firstName', 'John');
		assert.exists(createdEmployee);
		assert.equal(createdEmployee!.firstName, 'John');
		assert.equal(createdEmployee!.lastName, 'Doe');
		assert.equal(createdEmployee!.position, 'Sound Engineer');

		hash.restore();
	});

	test('PUT /admin/employees without permission returns unauthorized', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();

		const response = await client
			.put(route('admin.employees.create'))
			.header('referrer', route('admin.employees.render'))
			.json({
				firstName: 'John',
				lastName: 'Doe',
				position: 'Sound Engineer',
			})
			.loginAs(user)
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});

	test('PATCH /admin/employees/:id with valid body updates employee and shows success notification', async ({
		client,
		route,
	}) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.employees.update']);

		const employee = await EmployeeFactory.create();

		const response = await client
			.patch(route('admin.employees.update', { id: employee.id }))
			.header('referrer', route('admin.employees.render'))
			.json({
				firstName: 'Jane',
				lastName: 'Smith',
				position: 'Lighting Technician',
			})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('notification', {
			type: NotificationType.Success,
			message: 'Employee updated successfully',
		});

		hash.restore();
	});

	test('PATCH /admin/employees/:id with empty body returns validation errors', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.employees.update']);

		const employee = await EmployeeFactory.create();

		const response = await client
			.patch(route('admin.employees.update', { id: employee.id }))
			.header('referrer', route('admin.employees.render'))
			.json({})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('errors', {
			firstName: ['The firstName field must be defined'],
			lastName: ['The lastName field must be defined'],
			position: ['The position field must be defined'],
		});

		hash.restore();
	});

	test('PATCH /admin/employees/:id with invalid body returns validation errors', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.employees.update']);

		const employee = await EmployeeFactory.create();

		const response = await client
			.patch(route('admin.employees.update', { id: employee.id }))
			.header('referrer', route('admin.employees.render'))
			.json({
				firstName: '',
				lastName: '',
				position: 'Invalid Position',
			})
			.loginAs(user)
			.withCsrfToken()
			.redirects(0);

		response.assertStatus(302);
		response.assertFlashMessage('errors', {
			firstName: ['The firstName field must be defined'],
			lastName: ['The lastName field must be defined'],
			position: ['The selected position is invalid'],
		});

		hash.restore();
	});

	test('PATCH /admin/employees/:id with non-existent employee returns 404', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		await giveUserPermissions(user, ['admin.employees.update']);

		const response = await client
			.patch(route('admin.employees.update', { id: 99_999 }))
			.header('referrer', route('admin.employees.render'))
			.json({
				firstName: 'Jane',
				lastName: 'Smith',
				position: 'Lighting Technician',
			})
			.loginAs(user)
			.withCsrfToken();

		response.assertStatus(404);

		hash.restore();
	});

	test('PATCH /admin/employees/:id without permission returns unauthorized', async ({ client, route }) => {
		hash.fake();

		const user = await UserFactory.create();
		const employee = await EmployeeFactory.create();

		const response = await client
			.patch(route('admin.employees.update', { id: employee.id }))
			.header('referrer', route('admin.employees.render'))
			.json({
				firstName: 'Jane',
				lastName: 'Smith',
				position: 'Lighting Technician',
			})
			.loginAs(user)
			.withCsrfToken()
			.withInertia();

		response.assertStatus(200);
		response.assertRedirectsTo(route('home'));

		hash.restore();
	});
});
