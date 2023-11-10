import { Kysely, sql } from 'kysely';
import { DATABASE_TABLE } from '@constants';

const { NAME, SCHEMA } = DATABASE_TABLE.CART_ITEM;
const { NAME: CART_NAME, SCHEMA: CART_SCHEMA } = DATABASE_TABLE.CART;
const { NAME: PRODUCT_NAME, SCHEMA: PRODUCT_SCHEMA } = DATABASE_TABLE.PRODUCT;

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'varchar(50)', (column) =>
      column.primaryKey().defaultTo(sql`uuid_generate_v4()`),
    )
    .addColumn(SCHEMA.AMOUNT, 'integer', (column) =>
      column.notNull().defaultTo(1),
    )
    .addColumn(SCHEMA.CREATED_AT, 'timestamp', (column) =>
      column.defaultTo(sql`now()`),
    )
    .addColumn(SCHEMA.UPDATED_AT, 'timestamp', (column) =>
      column.defaultTo(sql`now()`),
    )
    .addColumn(SCHEMA.CART_ID, 'varchar(50)', (column) =>
      column
        .references(`${CART_NAME}.${CART_SCHEMA.ID}`)
        .onDelete('cascade')
        .notNull(),
    )
    .addColumn(SCHEMA.PRODUCT_ID, 'varchar(50)', (column) =>
      column
        .references(`${PRODUCT_NAME}.${PRODUCT_SCHEMA.ID}`)
        .onDelete('cascade')
        .notNull(),
    )
    .addUniqueConstraint(
      `${NAME}_${SCHEMA.CART_ID}_${SCHEMA.PRODUCT_ID}`,
      [SCHEMA.CART_ID, SCHEMA.PRODUCT_ID],
    )
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
