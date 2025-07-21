import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
	protected tableName = 'employees';

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');
			table.string('first_name').notNullable();
			table.string('last_name').notNullable();
			table.string('position').notNullable();

			table.timestamp('created_at');
			table.timestamp('updated_at');
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
