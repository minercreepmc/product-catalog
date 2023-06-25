import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { CreateReviewerRequestValidator } from '@use-cases/create-reviewer/application-services';
import { CreateReviewerRequestDto } from '@use-cases/create-reviewer/dtos';

describe('CreateReviewerValidator', () => {
  let createReviewerValidator: CreateReviewerRequestValidator;
  const createReviewerCommand = new CreateReviewerRequestDto({
    name: 'John Doe',
    email: 'johndoe@example.com',
    role: 'regular',
  });

  beforeEach(() => {
    createReviewerValidator = new CreateReviewerRequestValidator();
  });

  describe('validate', () => {
    it('should return a successful validation response for a valid command', () => {
      const response = createReviewerValidator.validate(createReviewerCommand);

      expect(response.isValid).toBe(true);
      expect(response.exceptions).toHaveLength(0);
    });

    it('should return a validation response with exceptions for an invalid command', () => {
      const invalidCommand = new CreateReviewerRequestDto({
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
