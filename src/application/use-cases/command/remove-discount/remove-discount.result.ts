import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { Result } from 'oxide.ts';
import { RemoveDiscountResponseDto } from './remove-discount.dto';

export type RemoveDiscountSuccess = RemoveDiscountResponseDto;
export type RemoveDiscountFailure =
  Array<DiscountDomainExceptions.DoesNotExist>;
export type RemoveDiscountResult = Result<
  RemoveDiscountSuccess,
  RemoveDiscountFailure
>;
