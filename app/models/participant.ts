import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm';
import * as relations from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

import Event from './event.js';

export default class Participant extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare businessName: string;

	@column()
	declare siret: string;

	@column()
	declare email: string;

	@column()
	declare phoneNumber: string;

	@hasMany(() => Event)
	declare events: relations.HasMany<typeof Event>;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;
}
