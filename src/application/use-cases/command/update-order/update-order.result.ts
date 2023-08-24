import { OrderDomainExceptions } from '@domain-exceptions/order';
import { Result } from 'oxide.ts';
import { UpdateOrderResponseDto } from './update-order.dto';

export type UpdateOrderSuccess = UpdateOrderResponseDto;
export type UpdateOrderFailure = Array<OrderDomainExceptions.DoesNotExist>;
export type UpdateOrderResult = Result<UpdateOrderSuccess, UpdateOrderFailure>;
