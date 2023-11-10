import { Kysely, sql } from 'kysely';
import { DATABASE_TABLE } from '@constants';

const { NAME, SCHEMA } = DATABASE_TABLE.PRODUCT_IMAGE;
const { NAME: PRODUCT_NAME, SCHEMA: PRODUCT_SCHEMA } = DATABASE_TABLE.PRODUCT;

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'varchar(50)', (column) =>
      column.primaryKey().defaultTo(sql`uuid_generate_v4()`),
    )
    .addColumn(SCHEMA.URL, 'varchar(255)', (column) => column.notNull())
    .addColumn(SCHEMA.CREATED_AT, 'timestamp', (column) =>
      column.defaultTo(sql`now()`),
    )
    .addColumn(SCHEMA.PRODUCT_ID, 'varchar(50)', (column) =>
      column
        .references(`${PRODUCT_NAME}.${PRODUCT_SCHEMA.ID}`)
        .onDelete('cascade')
        .notNull(),
    )
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
