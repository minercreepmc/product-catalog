import { Kysely, sql } from 'kysely';
import { DATABASE_TABLE } from '@constants';

const { NAME, SCHEMA } = DATABASE_TABLE.USERS;

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'varchar(50)', (column) =>
      column.primaryKey().defaultTo(sql`uuid_generate_v4()`),
    )
    .addColumn(SCHEMA.USERNAME, 'varchar(255)', (column) => column.notNull())
    .addColumn(SCHEMA.HASHED, 'varchar(255)', (column) => column.notNull())
    .addColumn(SCHEMA.ROLE, 'varchar(10)', (column) => column.notNull())
    .addColumn(SCHEMA.EMAIL, 'varchar(50)', (column) => column)
    .addColumn(SCHEMA.PHONE, 'varchar(50)', (column) => column)
    .addColumn(SCHEMA.FULL_NAME, 'varchar(50)')
    .addColumn(SCHEMA.CREATED_AT, 'timestamp', (column) =>
      column.defaultTo(sql`now()`),
    )
    .addColumn(SCHEMA.UPDATED_AT, 'timestamp', (column) =>
      column.defaultTo(sql`now()`),
    )
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
