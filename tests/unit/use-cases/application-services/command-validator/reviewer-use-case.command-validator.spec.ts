import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { ReviewerCommandValidator } from '@use-cases/application-services/command-validators';

describe('ReviewerCommandValidator', () => {
  let validator: ReviewerCommandValidator;

  beforeEach(() => {
    validator = new ReviewerCommandValidator();
  });

  it('should validate a valid command', () => {
    const command = {
      name: 'John Doe',
      email: 'johndoe@example.com',
    };

    const result = validator.validate(command);

    expect(result.isValid).toBe(true);
    expect(result.exceptions.length).toBe(0);
  });

  it('should fail to validate an invalid command', () => {
    const command = {
      name: '',
      email: 'invalid-email',
    };

    const result = validator.validate(command);

    expect(result.isValid).toBe(false);
    expect(result.exceptions).toIncludeAllMembers([
      new ReviewerDomainExceptions.NameDoesNotValid(),
      new ReviewerDomainExceptions.EmailDoesNotValid(),
    ]);
  });

  it('should fail to validate a command with an invalid name', () => {
    const command = {
      name: '',
      email: 'johndoe@example.com',
    };

    const result = validator.validate(command);

    expect(result.isValid).toBe(false);
    expect(result.exceptions).toIncludeAllMembers([
      new ReviewerDomainExceptions.NameDoesNotValid(),
    ]);
  });

  it('should fail to validate a command with an invalid email', () => {
    const command = {
      name: 'John Doe',
      email: 'invalid-email',
    };

    const result = validator.validate(command);

    expect(result.isValid).toBe(false);
    expect(result.exceptions).toIncludeAllMembers([
      new ReviewerDomainExceptions.EmailDoesNotValid(),
    ]);
  });

  it('should fail to validate a command with both invalid name and email', () => {
    const command = {
      name: '',
      email: 'invalid-email',
    };

    const result = validator.validate(command);

    expect(result.isValid).toBe(false);
    expect(result.exceptions).toIncludeAllMembers([
      new ReviewerDomainExceptions.NameDoesNotValid(),
      new ReviewerDomainExceptions.EmailDoesNotValid(),
    ]);
  });

  it('should clear exceptions before validating a new command', () => {
    const command = {
      name: '',
      email: 'invalid-email',
    };

    let result = validator.validate(command);

    expect(result.isValid).toBe(false);
    expect(result.exceptions).toIncludeAllMembers([
      new ReviewerDomainExceptions.NameDoesNotValid(),
      new ReviewerDomainExceptions.EmailDoesNotValid(),
    ]);

    command.name = 'John Doe';
    result = validator.validate(command);

    expect(result.isValid).toBe(false);
    expect(result.exceptions).toIncludeAllMembers([
      new ReviewerDomainExceptions.EmailDoesNotValid(),
    ]);
  });
});
