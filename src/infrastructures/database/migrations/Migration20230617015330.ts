import { Migration } from '@mikro-orm/migrations';

export class Migration20230617015330 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "reviewers" add column "password" varchar(255) not null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "reviewers" drop column "password";');
  }

}
