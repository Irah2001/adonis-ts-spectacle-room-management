import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import type { BelongsTo } from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

import User from './user.js';

export default class Token extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare userId: number | null;

	@column()
	declare type: string;

	@column()
	declare token: string;

	@column.dateTime()
	declare expiresAt: DateTime;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;

	@belongsTo(() => User)
	declare user: BelongsTo<typeof User>;
}
