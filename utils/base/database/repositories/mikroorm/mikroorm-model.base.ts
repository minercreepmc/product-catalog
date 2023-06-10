import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class MikroOrmModelBase {
  constructor(props?: MikroOrmModelBase) {
    this.id = props?.id;
    this.createdAt = props?.createdAt;
    this.updatedAt = props?.updatedAt;
  }

  @PrimaryKey()
  id: string;

  @Property()
  createdAt: Date = new Date();

  @Property()
  updatedAt: Date = new Date();
}
