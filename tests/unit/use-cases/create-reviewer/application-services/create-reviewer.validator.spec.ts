import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { CreateReviewerValidator } from '@use-cases/create-reviewer/application-services';
import { CreateReviewerCommand } from '@use-cases/create-reviewer/dtos';

describe('CreateReviewerValidator', () => {
  let createReviewerValidator: CreateReviewerValidator;
  const createReviewerCommand = new CreateReviewerCommand({
    name: 'John Doe',
    email: 'johndoe@example.com',
    role: 'regular',
  });

  beforeEach(() => {
    createReviewerValidator = new CreateReviewerValidator();
  });

  describe('validate', () => {
    it('should return a successful validation response for a valid command', () => {
      const response = createReviewerValidator.validate(createReviewerCommand);

      expect(response.isValid).toBe(true);
      expect(response.exceptions).toHaveLength(0);
    });

    it('should return a validation response with exceptions for an invalid command', () => {
      const invalidCommand = new CreateReviewerCommand({
        name: '',
        email: 'invalid-email',
        role: '',
      });
      const expectedExceptions = [
        new ReviewerDomainExceptions.NameDoesNotValid(),
        new ReviewerDomainExceptions.EmailDoesNotValid(),
        new ReviewerDomainExceptions.RoleDoesNotValid(),
      ];

      const response = createReviewerValidator.validate(invalidCommand);

      expect(response.isValid).toBe(false);
      expect(response.exceptions).toIncludeAllMembers(expectedExceptions);
    });
  });
});
