import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'

import Event from './event.js'
import RessourceNeed from './ressource_need.js'

export default class EventNeed extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

	@column()
	declare description: string

	@column()
	declare isReady: boolean

	@column()
  declare eventId: number

  @belongsTo(() => Event)
  declare event: relations.BelongsTo<typeof Event>

	@hasMany(() => RessourceNeed)
	declare ressourceNeeds: relations.HasMany<typeof RessourceNeed>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}