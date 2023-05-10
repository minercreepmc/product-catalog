import { AbstractTypeOrmModel } from 'nest-typeorm-common-classes';
import { Column, Entity } from 'typeorm';

@Entity('category')
export class CategoryTypeOrmModel extends AbstractTypeOrmModel {
  constructor(options?: CategoryTypeOrmModel) {
    super(options);
    this.name = options?.name;
    this.description = options?.description;
    this.parentIds = options?.parentIds;
    this.subCategoryIds = options?.subCategoryIds;
    this.productIds = options?.productIds;
  }

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column('jsonb', { array: true, nullable: true })
  parentIds: string[];

  @Column('jsonb', { array: true, nullable: true })
  subCategoryIds: string[];

  @Column('jsonb', { array: true, nullable: true })
  productIds: string[];
}
