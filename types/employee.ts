export const EMPLOYEE_POSITIONS = [
	'Sound Engineer',
	'Lighting Technician',
	'Security',
	'Bartender',
	'Stage Manager',
	'Box Office',
] as const;

export type EmployeePosition = (typeof EMPLOYEE_POSITIONS)[number];
