import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
	protected tableName = 'ressources';

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');
			table.string('type').notNullable();
			table.integer('stock').unsigned().notNullable();

			table.timestamp('created_at');
			table.timestamp('updated_at');
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
