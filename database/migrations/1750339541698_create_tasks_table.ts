import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'tasks'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
			table.timestamp('start_date')
			table.timestamp('end_date')
			table.integer('employee_id').unsigned().references('id').inTable('employees').onDelete('CASCADE')
			table.integer('room_id').unsigned().references('id').inTable('rooms').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}