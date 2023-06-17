import { Migration } from '@mikro-orm/migrations';

export class Migration20230617024955 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "reviewers" drop column "email";');
    this.addSql('alter table "reviewers" drop column "username";');
    this.addSql('alter table "reviewers" drop column "password";');
  }

  async down(): Promise<void> {
    this.addSql('alter table "reviewers" add column "email" varchar(255) not null, add column "username" varchar(255) not null, add column "password" varchar(255) not null;');
  }

}
