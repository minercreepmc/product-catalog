import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE "cart_item" (
      id varchar(255) not null primary key DEFAULT uuid_generate_v4(),
      _id int generated by default as identity,
      created_at timestamp without time zone not null default now(),
      updated_at timestamp without time zone not null default now(),
      deleted_at timestamp without time zone,
      amount int not null default 1,
      cart_id varchar(255) REFERENCES cart(id) ON DELETE CASCADE,
      product_id varchar(255) REFERENCES product(id) ON DELETE CASCADE,
      UNIQUE(product_id, cart_id)
    )
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`DROP TABLE "cart_item";`);
}
