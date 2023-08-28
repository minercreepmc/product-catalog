import { CartDomainExceptions } from '@domain-exceptions/cart';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { UserDomainExceptions } from '@domain-exceptions/user';
import { Result } from 'oxide.ts';
import { CreateOrderResponseDto } from './create-order.dto';

export type CreateOrderSuccess = CreateOrderResponseDto;
export type CreateOrderFailure = Array<
  | UserDomainExceptions.DoesNotExist
  | CartDomainExceptions.DoesNotExist
  | ProductDomainExceptions.DoesNotExist
>;

export type CreateOrderResult = Result<CreateOrderSuccess, CreateOrderFailure>;
