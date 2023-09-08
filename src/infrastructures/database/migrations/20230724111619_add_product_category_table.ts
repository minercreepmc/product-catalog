import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE product_category ( 
      product_id varchar(255) REFERENCES product(id) ON DELETE CASCADE,
      category_id varchar(255) REFERENCES category(id) ON DELETE CASCADE,
      PRIMARY KEY (product_id, category_id)
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw('DROP TABLE product_category;');
}
