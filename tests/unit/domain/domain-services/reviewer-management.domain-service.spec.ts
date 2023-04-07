import {
  CreateReviewerAggregateOptions,
  ReviewerAggregate,
} from '@aggregates/reviewer';
import { ReviewerCreatedDomainEvent } from '@domain-events/reviewer';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { ReviewerRepositoryPort } from '@domain-interfaces';
import { ReviewerManagementDomainService } from '@domain-services';
import {
  ReviewerEmailValueObject,
  ReviewerNameValueObject,
} from '@value-objects/reviewer';
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
      ).rejects.toThrow(ReviewerDomainExceptions.DoesExist);
      expect(reviewerRepository.findOneByEmail).toHaveBeenCalledWith(
        options.email,
      );
      expect(ReviewerAggregate.prototype.createReviewer).not.toHaveBeenCalled();
    });
  });
});
