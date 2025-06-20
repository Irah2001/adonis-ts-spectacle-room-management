import { DateTime } from 'luxon'
import { BaseModel, column, hasMany } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'

import RessourceNeed from './ressource_need.js'

export default class Ressource extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

	@column()
	declare type: string;

	@column()
	declare stock: number;

	@hasMany(() => RessourceNeed)
	declare ressourceNeeds: relations.HasMany<typeof RessourceNeed>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}