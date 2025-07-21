import factory from '@adonisjs/lucid/factories';

import Employee from '#models/employee';
import { EMPLOYEE_POSITIONS } from '#types/employee';

export const EmployeeFactory = factory
	.define(Employee, async ({ faker }) => ({
		firstName: faker.person.firstName(),
		lastName: faker.person.lastName(),
		position: faker.helpers.arrayElement(EMPLOYEE_POSITIONS),
	}))
	.state('Lighting Technician', (employee) => {
		employee.position = 'Lighting Technician';
	})
	.state('Sound Technician', (employee) => {
		employee.position = 'Sound Technician';
	})
	.state('Security', (employee) => {
		employee.position = 'Security';
	})
	.state('Bartender', (employee) => {
		employee.position = 'Bartender';
	})
	.state('Stage Manager', (employee) => {
		employee.position = 'Stage Manager';
	})
	.state('Box Office', (employee) => {
		employee.position = 'Box Office';
	})
	.build();
