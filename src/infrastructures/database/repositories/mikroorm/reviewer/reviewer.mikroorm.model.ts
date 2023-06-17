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
  role: string;

  // Currently we temporarily save these, later on other microservices handle it
  //@Property()
  //email: string;

  //@Property()
  //username: string;

  //@Property()
  //password: string;
}
