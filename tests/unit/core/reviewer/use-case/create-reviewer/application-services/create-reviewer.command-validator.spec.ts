import { ReviewerDomainExceptions } from '@reviewer-domain/domain-exceptions';
import { CreateReviewerCommandValidator } from '@src/core/reviewer/use-case/create-reviewer/application-services';
import { CreateReviewerCommand } from '@src/core/reviewer/use-case/create-reviewer/dtos';

describe('CreateReviewerCommandValidator', () => {
  let createReviewerCommandValidator: CreateReviewerCommandValidator;
  const createReviewerCommand = new CreateReviewerCommand({
    name: 'John Doe',
    email: 'johndoe@example.com',
  });

  beforeEach(() => {
    createReviewerCommandValidator = new CreateReviewerCommandValidator();
  });

  describe('validate', () => {
    it('should return a successful validation response for a valid command', () => {
      const response = createReviewerCommandValidator.validate(
        createReviewerCommand,
      );

      expect(response.isValid).toBe(true);
      expect(response.exceptions).toHaveLength(0);
    });

    it('should return a validation response with exceptions for an invalid command', () => {
      const invalidCommand = new CreateReviewerCommand({
        name: '',
        email: 'invalid-email',
      });
      const expectedExceptions = [
        new ReviewerDomainExceptions.NameIsNotValid(),
        new ReviewerDomainExceptions.EmailIsNotValid(),
      ];

      const response = createReviewerCommandValidator.validate(invalidCommand);

      expect(response.isValid).toBe(false);
      expect(response.exceptions).toHaveLength(2);
      expect(response.exceptions).toIncludeAllMembers(expectedExceptions);
    });
  });
});