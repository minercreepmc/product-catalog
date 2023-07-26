import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  return knex.raw(`
    CREATE TABLE "user" (
      id varchar(255) not null primary key,
      _id int generated by default as identity,
      username varchar(250) not null,
      hashed varchar(255) not null,
      role varchar(250) not null,
      created_at timestamp without time zone not null default now(),
      updated_at timestamp without time zone not null default now(),
      deleted_at timestamp without time zone
    );
  `);
}

export async function down(knex: Knex): Promise<void> {
  return knex.raw(`DROP TABLE "user";`);
}
