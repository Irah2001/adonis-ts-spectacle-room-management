import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import * as relations from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

import Event from './event.js';
import Task from './task.js';

export default class Room extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare name: string;

	@column()
	declare address: string;

	@column()
	declare capacity: number;

	@hasMany(() => Task)
	declare tasks: relations.HasMany<typeof Task>;

	@hasMany(() => Event)
	declare events: relations.HasMany<typeof Event>;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;
}
