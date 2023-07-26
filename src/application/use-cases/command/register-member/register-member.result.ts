import { UserDomainExceptions } from '@domain-exceptions/user';
import { Result } from 'oxide.ts';
import { RegisterMemberResponseDto } from './register-member.dto';

export type RegisterMemberSuccess = RegisterMemberResponseDto;
export type RegisterMemberFailure =
  Array<UserDomainExceptions.CredentialDoesNotValid>;
export type RegisterMemberResult = Result<
  RegisterMemberSuccess,
  RegisterMemberFailure
>;
