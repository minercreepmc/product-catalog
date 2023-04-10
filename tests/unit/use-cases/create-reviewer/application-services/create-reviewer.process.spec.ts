import { ReviewerAggregate } from '@aggregates/reviewer';
import { ReviewerCreatedDomainEvent } from '@domain-events/reviewer';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import { ReviewerManagementDomainService } from '@domain-services';
import { CreateReviewerProcess } from '@use-cases/create-reviewer/application-services';
import { CreateReviewerDomainOptions } from '@use-cases/create-reviewer/dtos';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';
import { mock, MockProxy } from 'jest-mock-extended';

describe('CreateReviewerProcess', () => {
  let createReviewerProcess: CreateReviewerProcess;
  let reviewerManagementService: MockProxy<ReviewerManagementDomainService>;
  let regularReviewer: MockProxy<ReviewerAggregate>;

  beforeEach(() => {
    reviewerManagementService = mock<ReviewerManagementDomainService>();
    createReviewerProcess = new CreateReviewerProcess(
      reviewerManagementService,
    );

    regularReviewer = mock<ReviewerAggregate>();
  });

  it('should create a new reviewer if email does not exist', async () => {
    const domainOptions: CreateReviewerDomainOptions = {
      email: new ReviewerEmailValueObject('test@example.com'),
      name: new ReviewerNameValueObject('test'),
      role: ReviewerRoleValueObject.createRegular(),
    };

    reviewerManagementService.getReviewerByEmail.mockResolvedValue(null);
    reviewerManagementService.createReviewer.mockResolvedValue(
      new ReviewerCreatedDomainEvent({
        reviewerId: new ReviewerIdValueObject('test'),
        details: {
          name: new ReviewerNameValueObject('test'),
          email: new ReviewerEmailValueObject('test@example.com'),
          role: ReviewerRoleValueObject.createRegular(),
        },
      }),
    );

    const result = await createReviewerProcess.execute(domainOptions);

    expect(result.isOk()).toBeTruthy();
    expect(result.unwrap()).toBeInstanceOf(ReviewerCreatedDomainEvent);
  });

  it('should not create a new reviewer if email already exists', async () => {
    const domainOptions: CreateReviewerDomainOptions = {
      email: new ReviewerEmailValueObject('test@example.com'),
      name: new ReviewerNameValueObject('test'),
      role: ReviewerRoleValueObject.createRegular(),
    };

    reviewerManagementService.getReviewerByEmail.mockResolvedValue(
      regularReviewer,
    );

    const result = await createReviewerProcess.execute(domainOptions);

    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toEqual([
      new ReviewerDomainExceptions.DoesExist(),
    ]);
  });
});
