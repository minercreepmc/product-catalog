import { ProductDomainExceptions } from '@domain-exceptions/product';
import { Result } from 'oxide.ts';
import { UpdateCartResponseDto } from './update-cart.dto';

export type UpdateCartSuccess = UpdateCartResponseDto;
export type UpdateCartFailure = Array<ProductDomainExceptions.DoesNotExist>;
export type UpdateCartResult = Result<UpdateCartSuccess, UpdateCartFailure>;
