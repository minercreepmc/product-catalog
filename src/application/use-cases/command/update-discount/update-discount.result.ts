import { DiscountDomainExceptions } from '@domain-exceptions/discount';
import { Result } from 'oxide.ts';
import { UpdateDiscountResponseDto } from './update-discount.dto';

export type UpdateDiscountFailure =
  Array<DiscountDomainExceptions.DoesNotExist>;

export type UpdateDiscountSuccess = UpdateDiscountResponseDto;

export type UpdateDiscountResult = Result<
  UpdateDiscountSuccess,
  UpdateDiscountFailure
>;
