import { DomainExceptionBase } from '@base/domain';

export const mapDomainExceptionsToObjects = (errors: DomainExceptionBase[]) => {
  return errors.map((error) => ({
    code: error.code,
    message: error.message,
  }));
};
