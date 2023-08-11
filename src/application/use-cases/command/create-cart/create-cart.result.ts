import { UserDomainExceptions } from '@domain-exceptions/user';
import { Result } from 'oxide.ts';
import { CreateCartResponseDto } from './create-cart.dto';

export type CreateCartSuccess = CreateCartResponseDto;
export type CreateCartFailure =
  Array<UserDomainExceptions.CredentialDoesNotValid>;
export type CreateCartResult = Result<CreateCartSuccess, CreateCartFailure>;
