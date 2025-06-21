import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
	protected tableName = 'events';

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');
			table.timestamp('date');
			table.string('status').notNullable();
			table.integer('seats').notNullable();
			table.string('description').notNullable();
			table.boolean('is_ready').defaultTo(false).notNullable();
			table.float('price').notNullable();
			table.integer('room_id').unsigned().references('id').inTable('rooms').onDelete('CASCADE');
			table.integer('participant_id').unsigned().references('id').inTable('participants').onDelete('CASCADE');

			table.timestamp('created_at');
			table.timestamp('updated_at');
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
