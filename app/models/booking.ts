import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'

import Event from './event.js'
import Spectator from './spectator.js'

export default class Booking extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

	@column()
	declare eventId: number

	@column()
	declare spectatorId: number

	@column()
	declare status: string

	@belongsTo(() => Event)
	declare event: relations.BelongsTo<typeof Event>

	@belongsTo(() => Spectator)
	declare spectator: relations.BelongsTo<typeof Spectator>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}