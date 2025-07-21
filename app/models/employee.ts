import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import * as relations from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

import Task from './task.js';

export default class Employee extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare firstName: string;

	@column()
	declare lastName: string;

	@column()
	declare position: string;

	@hasMany(() => Task)
	declare tasks: relations.HasMany<typeof Task>;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;
}
