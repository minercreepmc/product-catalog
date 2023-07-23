import { DomainExceptionBase } from '@base/domain';
import { CommandBase } from '@base/use-cases';
import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { DiscountIdValueObject } from '@value-objects/discount';
import { ArrayNotEmpty, IsArray, validateSync } from 'class-validator';

export class RemoveDiscountsCommand implements CommandBase {
  @IsArray()
  @ArrayNotEmpty()
  readonly ids: DiscountIdValueObject[];

  constructor(options: RemoveDiscountsCommand) {
    this.ids = options.ids;
  }

  validate?(): DomainExceptionBase[] {
    let isValid: boolean;

    if (validateSync(this).length > 0) {
      isValid = false;
    }

    let exception: DomainExceptionBase;

    isValid = !this.ids.some((id) => {
      exception = id.validate();
      if (exception) return true;
      return false;
    });

    if (!isValid) {
      return [new DiscountDomainExceptions.IdDoesNotValid()];
    } else {
      return [];
    }
  }
}

export class RemoveDiscountsResponseDto {
  readonly ids: string[];

  constructor(options: RemoveDiscountsResponseDto) {
    this.ids = options.ids;
  }
}
