import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
	protected tableName = 'bookings';

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');
			table.integer('event_id').unsigned().references('id').inTable('events').onDelete('CASCADE');
			table.integer('spectator_id').unsigned().references('id').inTable('spectators').onDelete('CASCADE');
			table.string('status').notNullable();

			table.timestamp('created_at');
			table.timestamp('updated_at');
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
