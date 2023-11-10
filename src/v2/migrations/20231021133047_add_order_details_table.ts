import { Kysely, sql } from 'kysely';
import { DATABASE_TABLE } from '@constants';

const { NAME, SCHEMA } = DATABASE_TABLE.ORDER_DETAILS;
const { NAME: USERS_NAME, SCHEMA: USERS_SCHEMA } = DATABASE_TABLE.USERS;
const { NAME: ADDRESS_NAME, SCHEMA: ADDRESS_SCHEMA } = DATABASE_TABLE.ADDRESS;
const { NAME: SHIPPING_FEE_NAME, SCHEMA: SHIPPING_FEE_SCHEMA } =
  DATABASE_TABLE.SHIPPING_FEE;
const { NAME: SHIPPING_METHOD_NAME, SCHEMA: SHIPPING_METHOD_SCHEMA } =
  DATABASE_TABLE.SHIPPING_METHOD;

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'uuid', (column) =>
      column.primaryKey().defaultTo(sql`uuid_generate_v4()`),
    )
    .addColumn(SCHEMA.TOTAL_PRICE, 'bigint', (column) => column.notNull())
    .addColumn(SCHEMA.STATUS, 'varchar(10)', (column) => column.notNull())
    .addColumn(SCHEMA.CREATED_AT, 'timestamp', (column) =>
      column.defaultTo(sql`now()`),
    )
    .addColumn(SCHEMA.UPDATED_AT, 'timestamp', (column) =>
      column.defaultTo(sql`now()`),
    )
    .addColumn(SCHEMA.MEMBER_ID, 'uuid', (column) =>
      column
        .references(`${USERS_NAME}.${USERS_SCHEMA.ID}`)
        .onDelete('cascade')
        .notNull(),
    )
    .addColumn(SCHEMA.ADDRESS_ID, 'uuid', (column) =>
      column
        .references(`${ADDRESS_NAME}.${ADDRESS_SCHEMA.ID}`)
        .onDelete('set null')
        .notNull(),
    )
    .addColumn(SCHEMA.SHIPPING_FEE_ID, 'uuid', (column) =>
      column
        .references(`${SHIPPING_FEE_NAME}.${SHIPPING_FEE_SCHEMA.ID}`)
        .onDelete('set null')
        .notNull(),
    )
    .addColumn(SCHEMA.SHIPPING_METHOD_ID, 'uuid', (column) =>
      column
        .references(`${SHIPPING_METHOD_NAME}.${SHIPPING_METHOD_SCHEMA.ID}`)
        .onDelete('set null')
        .notNull(),
    )
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
