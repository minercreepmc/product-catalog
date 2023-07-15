import { Migration } from '@mikro-orm/migrations';

export class Migration20230715003034 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "categories" rename column "sub_category_ids" to "sub_ids";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "categories" rename column "sub_ids" to "sub_category_ids";');
  }

}
