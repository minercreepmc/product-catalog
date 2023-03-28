import { AbstractTypeOrmModel } from 'nest-typeorm-common-classes';
import { Column, Entity } from 'typeorm';

@Entity('product')
export class ProductTypeOrmModel extends AbstractTypeOrmModel {
  constructor(options?: ProductTypeOrmModel) {
    super(options);
    this.name = options?.name;
    this.description = options?.description;
    this.price = options?.price;
    this.image = options?.image;
    this.attributes = options?.attributes;
    this.status = options?.status;
  }
  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ type: 'jsonb' })
  price: {
    amount: number;
    currency: string;
  };

  @Column({ nullable: true })
  image?: string;

  @Column({ type: 'jsonb', nullable: true })
  attributes?: {
    variations?: {
      color?: string;
      size?: string;
      weight?: {
        amount: number;
        unit: string;
      };
    }[];
  };

  @Column()
  status: string;

  @Column({ nullable: true })
  submittedBy?: string;

  @Column({ nullable: true })
  approvedBy?: string;

  @Column({ nullable: true })
  rejectedBy?: string;

  @Column({ nullable: true })
  rejectionReason?: string;
}
