import { Kysely, sql } from 'kysely';
import { DATABASE_TABLE } from '@constants';

const { NAME, SCHEMA } = DATABASE_TABLE.SHIPPING_FEE;

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'uuid', (column) =>
      column.primaryKey().defaultTo(sql`uuid_generate_v4()`),
    )
    .addColumn(SCHEMA.NAME, 'varchar(50)', (column) =>
      column.notNull().unique(),
    )
    .addColumn(SCHEMA.FEE, 'integer', (column) => column.notNull())
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
