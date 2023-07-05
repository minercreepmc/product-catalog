import { GenericDomainExceptions } from '@domain-exceptions';
import { AbstractValueObject } from 'common-base-classes';

export interface FileValueObjectDetails {
  name: string;
  buffer: Buffer;
}

export class FileValueObject extends AbstractValueObject<FileValueObjectDetails> {
  constructor(details: FileValueObjectDetails) {
    const validated = FileValueObject.validate(details);
    if (!validated.isValid) {
      throw new GenericDomainExceptions.FileDoesNotValid();
    }
    super(details);
  }

  static validate(candidate: FileValueObjectDetails) {
    if (!candidate || !candidate.name || !Buffer.isBuffer(candidate.buffer)) {
      return {
        isValid: false,
        exceptions: [new GenericDomainExceptions.FileDoesNotValid()],
      };
    }

    return {
      isValid: true,
      exceptions: [],
    };
  }
}
