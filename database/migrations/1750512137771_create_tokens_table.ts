import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
	protected tableName = 'tokens';

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');
			table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
			table.string('type').notNullable();
			table.string('token', 64).notNullable().unique();

			table.timestamp('expires_at');
			table.timestamp('created_at');
			table.timestamp('updated_at');
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
