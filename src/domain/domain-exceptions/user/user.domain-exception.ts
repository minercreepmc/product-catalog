import { DomainExceptionBase } from '@base/domain';
import { UserDomainExceptionCodes } from './user.domain-exception-code';

export namespace UserDomainExceptions {
  export class DoesNotExist extends DomainExceptionBase {
    readonly message = 'User does not exist';
    readonly code = UserDomainExceptionCodes.DoesNotExist;
  }

  export class AlreadyExists extends DomainExceptionBase {
    readonly message = 'User already exists';
    readonly code = UserDomainExceptionCodes.AlreadyExists;
  }

  export class FullNameDoesNotValid extends DomainExceptionBase {
    readonly message = 'User full name does not exist';
    readonly code = UserDomainExceptionCodes.FullNameDoesNotValid;
  }

  export class UsernameAlreadyExists extends DomainExceptionBase {
    readonly message = 'User name already exists';
    readonly code = UserDomainExceptionCodes.UsernameAlreadyExists;
  }

  export class IdDoesNotValid extends DomainExceptionBase {
    readonly message = 'User id does not valid';
    readonly code = UserDomainExceptionCodes.IdDoesNotValid;
  }

  export class RoleDoesNotValid extends DomainExceptionBase {
    readonly message = 'User role does not valid';
    readonly code = UserDomainExceptionCodes.RoleDoesNotValid;
  }

  export class UsernameDoesNotValid extends DomainExceptionBase {
    readonly message = 'User name does not valid';
    readonly code = UserDomainExceptionCodes.UsernameDoesNotValid;
  }

  export class PasswordDoesNotValid extends DomainExceptionBase {
    readonly message = 'User password does not valid';
    readonly code = UserDomainExceptionCodes.PasswordDoesNotValid;
  }

  export class CredentialDoesNotValid extends DomainExceptionBase {
    readonly message = 'User credential does not valid';
    readonly code = UserDomainExceptionCodes.CredentialDoesNotValid;
  }
}
