import { Migration } from '@mikro-orm/migrations';

export class Migration20230610003516 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "categories" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "description" varchar(255) null, "parent_ids" text[] null, "sub_category_ids" text[] null, "product_ids" text[] null, constraint "categories_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "categories" cascade;');
  }

}
