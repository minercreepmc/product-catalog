import { ReviewerDomainExceptions } from '@reviewer-domain/domain-exceptions';
import { ReviewerManagementDomainService } from '@reviewer-domain/domain-services';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
  ReviewerNameValueObject,
} from '@reviewer-domain/value-objects';
import { CreateReviewerBusinessValidator } from '@reviewer-use-case/create-reviewer/application-services';
import { CreateReviewerDomainOptions } from '@reviewer-use-case/create-reviewer/dtos';

describe('CreateReviewerBusinessValidator', () => {
  let createReviewerBusinessValidator: CreateReviewerBusinessValidator;
  let reviewerManagementDomainService: ReviewerManagementDomainService;

  const createReviewerDomainOptions: CreateReviewerDomainOptions = {
    name: new ReviewerNameValueObject('John Doe'),
    email: new ReviewerEmailValueObject('johndoe@example.com'),
  };
  const reviewerEmailValueObject: ReviewerEmailValueObject =
    new ReviewerEmailValueObject('johndoe@example.com');
  const reviewerDomainExceptionsIsExist: ReviewerDomainExceptions.IsExist =
    new ReviewerDomainExceptions.IsExist();

  beforeEach(() => {
    reviewerManagementDomainService = {
      getReviewerByEmail: jest.fn(),
    } as unknown as ReviewerManagementDomainService;
    createReviewerBusinessValidator = new CreateReviewerBusinessValidator(
      reviewerManagementDomainService,
    );

    jest.resetAllMocks();
  });

  describe('validateReviewerEmailMustNotExist', () => {
    it('should add a ReviewerDomainExceptions.IsExist exception if the email exists', async () => {
      (
        reviewerManagementDomainService.getReviewerByEmail as jest.Mock
      ).mockResolvedValueOnce({
        id: 1,
        name: 'John Doe',
        email: 'johndoe@example.com',
      });

      await createReviewerBusinessValidator.validateReviewerEmailMustNotExist(
        reviewerEmailValueObject,
      );

      expect(createReviewerBusinessValidator.exceptions).toEqual(
        expect.arrayContaining([reviewerDomainExceptionsIsExist]),
      );
    });

    it('should not add a ReviewerDomainExceptions.IsExist exception if the email does not exist', async () => {
      (
        reviewerManagementDomainService.getReviewerByEmail as jest.Mock
      ).mockResolvedValueOnce(null);

      await createReviewerBusinessValidator.validateReviewerEmailMustNotExist(
        reviewerEmailValueObject,
      );

      expect(createReviewerBusinessValidator.exceptions).toHaveLength(0);
    });
  });

  describe('validate', () => {
    it('should return a successful validation response for a valid domain options', async () => {
      (
        reviewerManagementDomainService.getReviewerByEmail as jest.Mock
      ).mockResolvedValueOnce(null);

      const response = await createReviewerBusinessValidator.validate(
        createReviewerDomainOptions,
      );

      expect(response.isValid).toBe(true);
      expect(response.exceptions).toHaveLength(0);
    });

    it('should return a validation response with exceptions for an invalid domain options', async () => {
      (
        reviewerManagementDomainService.getReviewerByEmail as jest.Mock
      ).mockResolvedValueOnce({
        id: new ReviewerIdValueObject('1'),
        name: new ReviewerNameValueObject('John Doe'),
        email: new ReviewerEmailValueObject('johndoe@example.com'),
      });

      const response = await createReviewerBusinessValidator.validate(
        createReviewerDomainOptions,
      );

      expect(response.isValid).toBe(false);
      expect(response.exceptions).toHaveLength(1);
      expect(response.exceptions).toEqual(
        expect.arrayContaining([reviewerDomainExceptionsIsExist]),
      );
    });
  });
});
