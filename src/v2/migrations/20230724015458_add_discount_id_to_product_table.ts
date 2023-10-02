import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    ALTER TABLE product
      ADD COLUMN discount_id varchar(255) REFERENCES discount(id);
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`
    ALTER TABLE product
      DROP COLUMN discount_id;
  `);
}
