import vine from '@vinejs/vine';
import type { Infer } from '@vinejs/vine/types';

import { EMPLOYEE_POSITIONS } from '#types/employee';

export const createEmployeeValidator = vine.compile(
	vine.object({
		firstName: vine.string().minLength(1).maxLength(255).trim(),
		lastName: vine.string().minLength(1).maxLength(255).trim(),
		position: vine.enum(EMPLOYEE_POSITIONS),
	}),
);

export type CreateEmployeeSchema = Infer<typeof createEmployeeValidator>;

export const updateEmployeeValidator = vine.compile(
	vine.object({
		firstName: vine.string().minLength(1).maxLength(255).trim(),
		lastName: vine.string().minLength(1).maxLength(255).trim(),
		position: vine.enum(EMPLOYEE_POSITIONS),
	}),
);

export type UpdateEmployeeSchema = Infer<typeof updateEmployeeValidator>;
