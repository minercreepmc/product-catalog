import { ProductDomainException } from '@product-domain/domain-exceptions';
import {
  CreateReviewerAggregateOptions,
  ReviewerAggregate,
} from '@reviewer-domain/aggregate';
import { ReviewerCreatedDomainEvent } from '@reviewer-domain/domain-events';
import { ReviewerDomainExceptions } from '@reviewer-domain/domain-exceptions';
import { ReviewerManagementDomainService } from '@reviewer-domain/domain-services';
import { ReviewerRepositoryPort } from '@reviewer-domain/interfaces';
import {
  ReviewerEmailValueObject,
  ReviewerNameValueObject,
} from '@reviewer-domain/value-objects';
import { mock, MockProxy } from 'jest-mock-extended';

describe('ReviewerManagementDomainService', () => {
  let reviewerManagementDomainService: ReviewerManagementDomainService;
  let reviewerRepository: MockProxy<ReviewerRepositoryPort>;
  const options: CreateReviewerAggregateOptions = {
    name: new ReviewerNameValueObject('John Doe'),
    email: new ReviewerEmailValueObject('john.doe@example.com'),
  };

  beforeEach(() => {
    reviewerRepository = mock<ReviewerRepositoryPort>();
    reviewerManagementDomainService = new ReviewerManagementDomainService(
      reviewerRepository,
    );
    jest.resetAllMocks();
  });

  describe('createReviewer', () => {
    it('should create a new reviewer and return a ReviewerCreatedDomainEvent', async () => {
      reviewerRepository.findOneByEmail.mockResolvedValue(null);

      const reviewerCreated = new ReviewerCreatedDomainEvent({
        reviewerId: new ReviewerAggregate().id,
        details: options,
      });

      const reviewerCreateSpy = jest
        .spyOn(ReviewerAggregate.prototype, 'createReviewer')
        .mockReturnValueOnce(reviewerCreated);

      const result = await reviewerManagementDomainService.createReviewer(
        options,
      );

      expect(result).toBe(reviewerCreated);
      expect(reviewerRepository.findOneByEmail).toHaveBeenCalledWith(
        options.email,
      );
      expect(ReviewerAggregate.prototype.createReviewer).toHaveBeenCalledWith(
        options,
      );
      expect(reviewerCreateSpy).toHaveBeenCalled();
    });

    it('should throw a ReviewerDomainException.IsExist error if the email already exists', async () => {
      reviewerRepository.findOneByEmail.mockResolvedValue(
        new ReviewerAggregate(),
      );

      await expect(
        reviewerManagementDomainService.createReviewer(options),
      ).rejects.toThrow(ReviewerDomainExceptions.IsExist);
      expect(reviewerRepository.findOneByEmail).toHaveBeenCalledWith(
        options.email,
      );
      expect(ReviewerAggregate.prototype.createReviewer).not.toHaveBeenCalled();
    });
  });
});
