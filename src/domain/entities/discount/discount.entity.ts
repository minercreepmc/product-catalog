import { DiscountCreatedDomainEvent } from '@domain-events/discount';
import { DiscountIdValueObject } from '@value-objects/discount';
import { DiscountNameValueObject } from '@value-objects/discount/discount-name.value-object';

interface CreateOptions {
  name: DiscountNameValueObject;
}

export class DiscountEntity {
  readonly id: DiscountIdValueObject;
  name: DiscountNameValueObject;

  createDiscount(options: CreateOptions) {
    const { name } = options;

    this.name = name;

    return new DiscountCreatedDomainEvent({
      id: this.id,
      name: this.name,
    });
  }

  constructor() {
    this.id = new DiscountIdValueObject();
  }
}
