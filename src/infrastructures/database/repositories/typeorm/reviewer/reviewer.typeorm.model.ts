import { AbstractTypeOrmModel } from 'nest-typeorm-common-classes';
import { Column, Entity } from 'typeorm';

@Entity('reviewer')
export class ReviewerTypeOrmModel extends AbstractTypeOrmModel {
  constructor(options?: ReviewerTypeOrmModel) {
    super(options);
    this.name = options?.name;
    this.email = options?.email;
  }
  @Column()
  name: string;

  @Column()
  email: string;
}
