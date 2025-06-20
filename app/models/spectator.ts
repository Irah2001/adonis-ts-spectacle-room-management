import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'

import Booking from './booking.js'

export default class Spectator extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

	@column()
	declare firstName: string;

	@column()
	declare lastName: string;

	@column()
	declare isAdult: boolean;

	@hasMany(() => Booking)
	declare booking: relations.HasMany<typeof Booking>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}