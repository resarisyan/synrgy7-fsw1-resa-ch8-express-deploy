import type { Knex } from 'knex';

const table = 'oauth_providers';
export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable(table, (table) => {
    table.uuid('id').primary().defaultTo(knex.fn.uuid());
    table.string('name').notNullable();
    table.string('email').notNullable();
    table.string('client_id').notNullable();
    table.string('client_secret').notNullable();
    table.string('redirect_uri').notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.dropTable(table);
}
