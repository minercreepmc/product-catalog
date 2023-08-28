import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE product_orders (
      product_id varchar(255) REFERENCES product(id),
      order_id varchar(255) REFERENCES orders(id),
      PRIMARY KEY (product_id, order_id)
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`DROP TABLE product_orders;`);
}
