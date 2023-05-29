import { DomainExceptionBase } from 'common-base-classes';

export const mapDomainExceptionsToObjects = (errors: DomainExceptionBase[]) => {
  return errors.map((error) => ({
    code: error.code,
    message: error.message,
  }));
};
