import { UserDomainExceptions } from '@domain-exceptions/user';
import { Result } from 'oxide.ts';
import { LogInResponseDto } from './log-in.dto';

export type LogInSuccess = LogInResponseDto;
export type LogInFailure = Array<UserDomainExceptions.CredentialDoesNotValid>;

export type LogInResult = Result<LogInSuccess, LogInFailure>;
