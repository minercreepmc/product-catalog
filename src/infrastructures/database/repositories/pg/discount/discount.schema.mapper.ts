import { DiscountAggregate } from '@aggregates/discount';
import { SchemaMapperBase } from '@base/database/repositories/pg';
import { Injectable } from '@nestjs/common';
import {
  DiscountActiveValueObject,
  DiscountDescriptionValueObject,
  DiscountIdValueObject,
  DiscountNameValueObject,
  DiscountPercentageValueObject,
} from '@value-objects/discount';
import { DiscountSchema } from './discount.schema';

@Injectable()
export class DiscountSchemaMapper
  implements SchemaMapperBase<DiscountAggregate, DiscountSchema>
{
  toDomain(model: DiscountSchema): DiscountAggregate {
    const { id, name, description, percentage, active } = model;
    return new DiscountAggregate({
      id: new DiscountIdValueObject(id),
      name: new DiscountNameValueObject(name),
      description: description
        ? new DiscountDescriptionValueObject(description)
        : undefined,
      percentage: new DiscountPercentageValueObject(percentage),
      active: new DiscountActiveValueObject(active),
    });
  }
  toPersistance(model: Partial<DiscountAggregate>): Partial<DiscountSchema> {
    const { id, name, description, percentage, active } = model;

    return {
      id: id?.value,
      name: name?.value,
      description: description?.value,
      percentage: percentage?.value,
      active: active?.value,
    };
  }
}
