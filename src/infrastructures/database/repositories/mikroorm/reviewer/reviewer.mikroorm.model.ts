import { Entity, Property } from '@mikro-orm/core';
import { MikroOrmModelBase } from '@utils/base/database/repositories/mikroorm';

@Entity({
  tableName: 'reviewers',
})
export class ReviewerMikroOrmModel extends MikroOrmModelBase {
  constructor(props: ReviewerMikroOrmModel) {
    super(props);
    Object.assign(this, props);
  }

  @Property()
  name: string;

  @Property()
  email: string;

  @Property()
  role: string;
}
