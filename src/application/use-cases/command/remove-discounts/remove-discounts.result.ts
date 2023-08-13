import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { Result } from 'oxide.ts';
import { RemoveDiscountsResponseDto } from './remove-discounts.dto';

export type RemoveDiscountsSuccess = RemoveDiscountsResponseDto;
export type RemoveDiscountsFailure =
  Array<DiscountDomainExceptions.DoesNotExist>;

export type RemoveDiscountsResult = Result<
  RemoveDiscountsSuccess,
  RemoveDiscountsFailure
>;
