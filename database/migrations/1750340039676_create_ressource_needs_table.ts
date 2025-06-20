import { BaseSchema } from '@adonisjs/lucid/schema'

export default class extends BaseSchema {
  protected tableName = 'ressource_needs'

  async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
			table.integer('ressource_id').unsigned().references('id').inTable('ressources').onDelete('CASCADE')
			table.integer('event_need_id').unsigned().references('id').inTable('event_needs').onDelete('CASCADE')
			table.integer('quantity').notNullable()

      table.timestamp('created_at')
      table.timestamp('updated_at')
    })
  }

  async down() {
    this.schema.dropTable(this.tableName)
  }
}