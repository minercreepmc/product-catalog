import { Migration } from '@mikro-orm/migrations';

export class Migration20230617002550 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "reviewers" add column "username" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "reviewers" drop column "username";');
  }

}
