import { Kysely, sql } from 'kysely';
import { DATABASE_TABLE } from '@constants';

const { NAME, SCHEMA } = DATABASE_TABLE.SHIPPING;
const { NAME: ORDER_DETAILS_NAME, SCHEMA: ORDER_DETAILS_SCHEMA } =
  DATABASE_TABLE.ORDER_DETAILS;
const { NAME: USERS_NAME, SCHEMA: USERS_SCHEMA } = DATABASE_TABLE.USERS;

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'uuid', (column) =>
      column.primaryKey().defaultTo(sql`uuid_generate_v4()`),
    )
    .addColumn(SCHEMA.DUE_DATE, 'timestamp', (column) => column.notNull())
    .addColumn(SCHEMA.CREATED_AT, 'timestamp', (column) =>
      column.defaultTo(sql`now()`),
    )
    .addColumn(SCHEMA.UPDATED_AT, 'timestamp', (column) =>
      column.defaultTo(sql`now()`),
    )
    .addColumn(SCHEMA.ORDER_ID, 'uuid', (column) =>
      column
        .references(`${ORDER_DETAILS_NAME}.${ORDER_DETAILS_SCHEMA.ID}`)
        .onDelete('cascade')
        .notNull(),
    )
    .addColumn(SCHEMA.SHIPPER_ID, 'uuid', (column) =>
      column
        .references(`${USERS_NAME}.${USERS_SCHEMA.ID}`)
        .onDelete('set null')
        .notNull(),
    )
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
