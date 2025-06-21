import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
	protected tableName = 'participants';

	async up() {
		this.schema.createTable(this.tableName, (table) => {
			table.increments('id');
			table.string('business_name').notNullable();
			table.string('siret').notNullable();
			table.string('email').notNullable();
			table.string('phone_number').notNullable();

			table.timestamp('created_at');
			table.timestamp('updated_at');
		});
	}

	async down() {
		this.schema.dropTable(this.tableName);
	}
}
