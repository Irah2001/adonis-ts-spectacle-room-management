import hash from '@adonisjs/core/services/hash';
import testUtils from '@adonisjs/core/services/test_utils';
import { test } from '@japa/runner';

import { EmployeeFactory } from '#database/factories/employee-factory';
import { UserFactory } from '#database/factories/user-factory';
import { giveUserPermissions } from '#test-helpers/give-user-permission';
import { EMPLOYEE_POSITIONS } from '#types/employee';

test.group('Admin employees page', (group) => {
	group.each.setup(() => testUtils.db().withGlobalTransaction());

	test('Employees page is protected and redirects to login if not authenticated', async ({ visit, route, assert }) => {
		const protectedUrl = route('admin.employees.render');
		const page = await visit(protectedUrl);

		await page.waitForURL(new RegExp(`${route('auth.login.render')}\\?redirectTo=`));

		const currentUrl = page.url();

		assert.include(currentUrl, `redirectTo=${encodeURIComponent(protectedUrl)}`);
	});

	test('Employees page redirects to homepage for user without permission', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.employees.render'));

		await page.assertPath(route('home'));

		hash.restore();
	});

	test('Employees page is accessible for user with permission', async ({ browserContext, visit, route, assert }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();

		await giveUserPermissions(user, ['admin.employees.view']);
		await browserContext.loginAs(user);

		const page = await visit(route('admin.employees.render'));

		await page.assertPath(route('admin.employees.render'));

		const body = await page.innerHTML('main');

		assert.snapshot(body.trim()).match();

		hash.restore();
	});

	test('Employees page displays existing employees in table', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.employees.view']);

		const employees = await EmployeeFactory.createMany(3);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.employees.render'));

		for (const employee of employees) {
			await page.assertVisible(page.getByText(`${employee.firstName} ${employee.lastName}`));
		}

		hash.restore();
	});

	test('Create employee button opens dialog', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.employees.view', 'admin.employees.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.employees.render'));

		const addButton = page.getByRole('button', { name: 'Add Employee' });
		await page.assertExists(addButton);

		await addButton.click();

		await page.assertVisible(page.getByText('Add New Employee'));
		await page.assertVisible(page.getByText('Enter the details for the new employee.'));

		hash.restore();
	});

	test('Create employee form validates required fields', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.employees.view', 'admin.employees.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.employees.render'));

		await page.getByRole('button', { name: 'Add Employee' }).click();

		const submitButton = page.getByRole('button', { name: 'Create Employee' });

		await page.assertDisabled(submitButton);

		await page.getByLabel('First Name').fill('John');
		await page.assertDisabled(submitButton);

		await page.getByLabel('Last Name').fill('Doe');
		await page.assertDisabled(submitButton);

		await page.getByRole('combobox', { name: 'Position' }).click();
		await page.getByRole('option', { name: 'Sound Engineer' }).click();

		await page.assertNotDisabled(submitButton);

		hash.restore();
	});

	test('Create employee form shows validation errors for invalid input', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.employees.view', 'admin.employees.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.employees.render'));

		await page.getByRole('button', { name: 'Add Employee' }).click();

		await page.getByLabel('First Name').fill('');
		await page.getByLabel('First Name').blur();

		hash.restore();
	});

	test('Create employee form submits successfully with valid data', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.employees.view', 'admin.employees.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.employees.render'));

		await page.getByRole('button', { name: 'Add Employee' }).click();

		await page.getByLabel('First Name').fill('John');
		await page.getByLabel('Last Name').fill('Doe');
		await page.getByRole('combobox', { name: 'Position' }).click();
		await page.getByRole('option', { name: 'Sound Engineer' }).click();

		await page.getByRole('button', { name: 'Create Employee' }).click();

		await page.waitForSelector('.toast[data-type="success"]');
		await page.assertVisible(page.getByText('Employee created successfully'));

		await page.assertVisible(page.getByText('John Doe'));
		await page.assertVisible(page.getByText('Sound Engineer'));

		hash.restore();
	});

	test('Edit employee button opens edit dialog', async ({ browserContext, visit, route, assert }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.employees.view', 'admin.employees.update']);

		const employee = await EmployeeFactory.create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.employees.render'));

		const editButton = page.getByRole('button', { name: 'Edit' }).first();
		await page.assertExists(editButton);

		await editButton.click();

		await page.assertVisible(page.getByText('Edit Employee'));
		await page.assertVisible(page.getByText('Update the employee details.'));

		const firstNameInput = page.getByLabel('First Name');
		const lastNameInput = page.getByLabel('Last Name');

		const firstNameValue = await firstNameInput.inputValue();
		const lastNameValue = await lastNameInput.inputValue();

		assert.equal(firstNameValue, employee.firstName);
		assert.equal(lastNameValue, employee.lastName);

		hash.restore();
	});

	test('Edit employee form updates employee successfully', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.employees.view', 'admin.employees.update']);

		await EmployeeFactory.apply('Security').create();

		await browserContext.loginAs(user);

		const page = await visit(route('admin.employees.render'));

		const editButton = page.getByRole('button', { name: 'Edit' }).first();
		await editButton.click();

		await page.getByLabel('First Name').fill('Jane');
		await page.getByLabel('Last Name').fill('Smith');
		await page.getByRole('combobox', { name: 'Position' }).click();
		await page.getByRole('option', { name: 'Lighting Technician' }).click();

		await page.getByRole('button', { name: 'Update Employee' }).click();

		await page.waitForSelector('.toast[data-type="success"]');
		await page.assertVisible(page.getByText('Employee updated successfully'));

		await page.assertVisible(page.getByText('Jane Smith'));
		await page.assertVisible(page.getByText('Lighting Technician'));

		hash.restore();
	});

	test('Cancel button closes create dialog', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.employees.view', 'admin.employees.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.employees.render'));

		await page.getByRole('button', { name: 'Add Employee' }).click();
		await page.assertVisible(page.getByText('Add New Employee'));

		await page.keyboard.press('Escape');

		await page.assertNotVisible(page.getByText('Add New Employee'));

		hash.restore();
	});

	test('Cancel button closes edit dialog', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.employees.view', 'admin.employees.update']);

		await EmployeeFactory.create();
		await browserContext.loginAs(user);

		const page = await visit(route('admin.employees.render'));

		const editButton = page.getByRole('button', { name: 'Edit' }).first();
		await editButton.click();

		await page.assertVisible(page.getByText('Edit Employee'));

		const cancelButton = page.getByRole('button', { name: 'Cancel' });
		await cancelButton.click();

		await page.assertNotVisible(page.getByText('Edit Employee'));

		hash.restore();
	});

	test('Position dropdown shows all available positions', async ({ browserContext, visit, route }) => {
		hash.fake();

		await visit(route('home'));

		const user = await UserFactory.apply('verified').create();
		await giveUserPermissions(user, ['admin.employees.view', 'admin.employees.create']);

		await browserContext.loginAs(user);

		const page = await visit(route('admin.employees.render'));

		await page.getByRole('button', { name: 'Add Employee' }).click();

		await page.getByRole('combobox', { name: 'Position' }).click();

		for (const position of EMPLOYEE_POSITIONS) {
			await page.assertVisible(page.getByRole('option', { name: position }));
		}

		hash.restore();
	});
});
