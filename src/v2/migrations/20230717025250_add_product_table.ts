import { Kysely, sql } from 'kysely';
import { DATABASE_TABLE } from '@constants';

const { NAME, SCHEMA } = DATABASE_TABLE.PRODUCT;
const { NAME: DISCOUNT_NAME, SCHEMA: DISCOUNT_SCHEMA } =
  DATABASE_TABLE.DISCOUNT;

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'varchar(50)', (column) =>
      column.primaryKey().defaultTo(sql`uuid_generate_v4()`),
    )
    .addColumn(SCHEMA.NAME, 'varchar(255)', (column) => column.notNull())
    .addColumn(SCHEMA.PRICE, 'bigint', (column) => column.notNull())
    .addColumn(SCHEMA.DESCRIPTION, 'varchar(500)')
    .addColumn(SCHEMA.CREATED_AT, 'timestamp', (column) =>
      column.defaultTo(sql`now()`),
    )
    .addColumn(SCHEMA.UPDATED_AT, 'timestamp', (column) =>
      column.defaultTo(sql`now()`),
    )
    .addColumn(SCHEMA.DISCOUNT_ID, 'varchar(50)', (column) =>
      column
        .references(`${DISCOUNT_NAME}.${DISCOUNT_SCHEMA.ID}`)
        .onDelete('set null'),
    )
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
