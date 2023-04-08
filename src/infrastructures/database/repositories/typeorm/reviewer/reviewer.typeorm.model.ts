import { AbstractTypeOrmModel } from 'nest-typeorm-common-classes';
import { Column, Entity } from 'typeorm';

@Entity('reviewer')
export class ReviewerTypeOrmModel extends AbstractTypeOrmModel {
  constructor(options?: ReviewerTypeOrmModel) {
    super(options);
    this.name = options?.name;
    this.email = options?.email;
    this.role = options?.role;
  }
  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  role: string;
}
