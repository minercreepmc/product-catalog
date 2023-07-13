import { Migration } from '@mikro-orm/migrations';

export class Migration20230712104707 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "outbox" ("id" serial primary key, "event_name" text not null, "payload" text not null);');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "outbox" cascade;');
  }

}
