import { Entity, Property } from '@mikro-orm/core';
import { MikroOrmModelBase } from '@utils/repositories/mikroorm';

@Entity({
  tableName: 'products',
})
export class ProductMikroOrmModel extends MikroOrmModelBase {
  constructor(props: ProductMikroOrmModel) {
    super(props);
    Object.assign(this, props);
  }
  @Property()
  name: string;

  @Property({ nullable: true })
  description?: string;

  @Property({ type: 'jsonb' })
  price: {
    amount: number;
    currency: string;
  };

  @Property({ nullable: true })
  image?: string;

  @Property({ type: 'jsonb', nullable: true })
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

  @Property()
  status: string;

  @Property({ nullable: true })
  submittedBy?: string;

  @Property({ nullable: true })
  approvedBy?: string;

  @Property({ nullable: true })
  rejectedBy?: string;

  @Property({ nullable: true })
  rejectionReason?: string;
}
