import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm';
import * as relations from '@adonisjs/lucid/types/relations';
import { DateTime } from 'luxon';

import EventNeed from './event_need.js';
import Ressource from './ressource.js';

export default class RessourceNeed extends BaseModel {
	@column({ isPrimary: true })
	declare id: number;

	@column()
	declare ressourceId: number;

	@column()
	declare eventNeedId: number;

	@column()
	declare quantity: number;

	@belongsTo(() => Ressource)
	declare ressource: relations.BelongsTo<typeof Ressource>;

	@belongsTo(() => EventNeed)
	declare eventNeed: relations.BelongsTo<typeof EventNeed>;

	@column.dateTime({ autoCreate: true })
	declare createdAt: DateTime;

	@column.dateTime({ autoCreate: true, autoUpdate: true })
	declare updatedAt: DateTime;
}
