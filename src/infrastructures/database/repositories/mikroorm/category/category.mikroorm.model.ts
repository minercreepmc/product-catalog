import { ArrayType, Entity, Property } from '@mikro-orm/core';
import { MikroOrmModelBase } from '@utils/base/database/repositories/mikroorm';

@Entity({
  tableName: 'categories',
})
export class CategoryMikroOrmModel extends MikroOrmModelBase {
  constructor(props: CategoryMikroOrmModel) {
    super(props);
    Object.assign(this, props);
  }

  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ type: ArrayType, nullable: true })
  parentIds: string[];

  @Property({ type: ArrayType, nullable: true })
  subCategoryIds: string[];

  @Property({ type: ArrayType, nullable: true })
  productIds: string[];
}
