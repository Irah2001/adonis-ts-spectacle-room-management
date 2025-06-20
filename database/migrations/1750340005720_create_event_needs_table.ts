import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'event_needs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
			table.string('description').notNullable()
			table.boolean('is_ready').defaultTo(false).notNullable()
			table.integer('event_id').unsigned().references('id').inTable('events').onDelete('CASCADE')

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}