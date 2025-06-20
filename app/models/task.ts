import { DateTime } from 'luxon'
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import * as relations from '@adonisjs/lucid/types/relations'

import Employee from './employee.js'
import Room from './room.js'

export default class Task extends BaseModel {
  @column({ isPrimary: true })
  declare id: number

	@column.dateTime()
  declare startDate: DateTime

	@column.dateTime()
  declare endDate: DateTime

	@column()
	declare employeeId: number

	@column()
	declare roomId: number

	@belongsTo(() => Employee)
	declare employee: relations.BelongsTo<typeof Employee>

	@belongsTo(() => Room)
	declare room: relations.BelongsTo<typeof Room>

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime
}