import { Migration } from '@mikro-orm/migrations';

export class Migration20230610003836 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "reviewers" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "email" varchar(255) not null, "role" varchar(255) not null, constraint "reviewers_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "reviewers" cascade;');
  }

}
