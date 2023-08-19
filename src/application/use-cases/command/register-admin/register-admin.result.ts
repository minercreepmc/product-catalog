import { UserDomainExceptions } from '@domain-exceptions/user';
import { Result } from 'oxide.ts';
import { RegisterAdminResponseDto } from './register-admin.dto';

export type RegisterAdminSuccess = RegisterAdminResponseDto;
export type RegisterAdminFailure =
  Array<UserDomainExceptions.CredentialDoesNotValid>;
export type RegisterAdminResult = Result<
  RegisterAdminSuccess,
  RegisterAdminFailure
>;
