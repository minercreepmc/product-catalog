import { Migration } from '@mikro-orm/migrations';

export class Migration20230609102045_CreateProduct extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "products" ("id" varchar(255) not null, "created_at" timestamptz(0) not null, "updated_at" timestamptz(0) not null, "name" varchar(255) not null, "description" varchar(255) null, "price" jsonb not null, "image" varchar(255) null, "attributes" jsonb null, "status" varchar(255) not null, "submitted_by" varchar(255) null, "approved_by" varchar(255) null, "rejected_by" varchar(255) null, "rejection_reason" varchar(255) null, constraint "products_pkey" primary key ("id"));');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "products" cascade;');
  }

}
