import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import { DiscountIdValueObject } from '@value-objects/discount';

export class RemoveDiscountCommand implements CommandBase {
  constructor(options: RemoveDiscountCommand) {
    this.id = options.id;
  }
  id: DiscountIdValueObject;

  validate?(): DomainExceptionBase[] {
    return [this.id.validate?.()].filter(
      (error) => error,
    ) as DomainExceptionBase[];
  }
}

export class RemoveDiscountResponseDto {
  constructor(options: RemoveDiscountResponseDto) {
    this.id = options.id;
  }
  id: string;
}
