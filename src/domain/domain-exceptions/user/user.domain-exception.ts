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

  export class UsernameAlreadyExists extends DomainExceptionBase {
    readonly message = 'User name already exists';
    readonly code = UserDomainExceptionCodes.UsernameAlreadyExists;
  }

  export class RoleDoesNotValid extends DomainExceptionBase {
    readonly message = 'User role does not valid';
    readonly code = UserDomainExceptionCodes.RoleDoesNotValid;
  }

  export class UsernameDoesNotValid extends DomainExceptionBase {
    readonly message = 'User name does not valid';
    readonly code = UserDomainExceptionCodes.UsernameDoesNotValid;
  }

  export class EmailAlreadyExists extends DomainExceptionBase {
    readonly message = 'User email already exists';
    readonly code = UserDomainExceptionCodes.EmailAlreadyExists;
  }

  export class EmailDoesNotExist extends DomainExceptionBase {
    readonly message = 'User email does not exist';
    readonly code = UserDomainExceptionCodes.EmailDoesNotExist;
  }

  export class EmailDoesNotValid extends DomainExceptionBase {
    readonly message = 'User email does not valid';
    readonly code = UserDomainExceptionCodes.EmailDoesNotValid;
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
