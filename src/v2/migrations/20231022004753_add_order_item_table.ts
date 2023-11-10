import { Kysely, sql } from 'kysely';
import { DATABASE_TABLE } from '@constants';

const { NAME, SCHEMA } = DATABASE_TABLE.ORDER_ITEM;
const { NAME: PRODUCT_NAME, SCHEMA: PRODUCT_SCHEMA } = DATABASE_TABLE.PRODUCT;
const { NAME: ORDER_DETAILS_NAME, SCHEMA: ORDER_DETAILS_SCHEMA } =
  DATABASE_TABLE.ORDER_DETAILS;

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'uuid', (column) =>
      column.primaryKey().defaultTo(sql`uuid_generate_v4()`),
    )
    .addColumn(SCHEMA.PRICE, 'bigint', (column) => column.notNull())
    .addColumn(SCHEMA.AMOUNT, 'integer', (column) => column.notNull())
    .addColumn(SCHEMA.CREATED_AT, 'timestamp', (column) =>
      column.defaultTo(sql`now()`),
    )
    .addColumn(SCHEMA.UPDATED_AT, 'timestamp', (column) =>
      column.defaultTo(sql`now()`),
    )
    .addColumn(SCHEMA.PRODUCT_ID, 'uuid', (column) =>
      column
        .references(`${PRODUCT_NAME}.${PRODUCT_SCHEMA.ID}`)
        .onDelete('set null')
        .notNull(),
    )
    .addColumn(SCHEMA.ORDER_ID, 'uuid', (column) =>
      column
        .references(`${ORDER_DETAILS_NAME}.${ORDER_DETAILS_SCHEMA.ID}`)
        .onDelete('cascade')
        .notNull(),
    )
    .addUniqueConstraint(`${NAME}_${SCHEMA.PRODUCT_ID}_${SCHEMA.ORDER_ID}`, [
      SCHEMA.PRODUCT_ID,
      SCHEMA.ORDER_ID,
    ])
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
