import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE "cart" (
      id varchar(255) not null primary key,
      _id int generated by default as identity,
      created_at timestamp without time zone not null default now(),
      updated_at timestamp without time zone not null default now(),
      deleted_at timestamp without time zone,
      user_id varchar(255) REFERENCES users(id)
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`DROP TABLE "cart";`);
}
