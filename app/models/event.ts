import { DateTime } from 'luxon'
import { BaseModel, column, hasMany, belongsTo } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'

import EventNeed from './event_need.js'
import Room from './room.js'
import Participant from './participant.js'

export default class Event extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

	@column.dateTime()
  declare date: DateTime

	@column()
	declare status: string

	@column()
	declare seats: number

	@column()
	declare description: string

	@column()
	declare isReady: boolean

	@column()
	declare price: number

	@column()
	declare roomId: number

	@column()
	declare participantId: number

	@belongsTo(() => Room)
	declare room: relations.BelongsTo<typeof Room>

	@belongsTo(() => Participant)
	declare participant: relations.BelongsTo<typeof Participant>

	@hasMany(() => EventNeed)
  declare eventNeeds: relations.HasMany<typeof EventNeed>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}