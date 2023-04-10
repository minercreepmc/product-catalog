import { ReviewerManagementDomainService } from '@domain-services';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { CreateReviewerProcess } from '@use-cases/create-reviewer/application-services';
import { CreateReviewerDomainOptions } from '@use-cases/create-reviewer/dtos';
import {
  ReviewerEmailValueObject,
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';

describe('CreateReviewerProcess Integration Test', () => {
  let createReviewerProcess: CreateReviewerProcess;
  let reviewerManagementService: ReviewerManagementDomainService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    reviewerManagementService = moduleFixture.get(
      ReviewerManagementDomainService,
    );
    createReviewerProcess = new CreateReviewerProcess(
      reviewerManagementService,
    );
  });

  describe('execute', () => {
    it('should create a reviewer when the email does not exist', async () => {
      // Arrange
      const domainOptions: CreateReviewerDomainOptions = {
        email: new ReviewerEmailValueObject('nonexistent_email@example.com'),
        name: new ReviewerNameValueObject('Nonexistent Name'),
        role: ReviewerRoleValueObject.createRegular(),
      };

      // Act
      const result = await createReviewerProcess.execute(domainOptions);

      // Assert
      expect(result.isOk()).toBeTruthy();
      // Add more assertions for the created reviewer's properties, such as ID or email.
    });

    it('should not create a reviewer when the email exists', async () => {
      // Arrange
      const domainOptions: CreateReviewerDomainOptions = {
        email: new ReviewerEmailValueObject('existing_email@example.com'),
        name: new ReviewerNameValueObject('Existing Name'),
        role: ReviewerRoleValueObject.createRegular(),
      };

      // Create a reviewer with the same email in the database
      const reviewerCreated = await reviewerManagementService.createReviewer(
        domainOptions,
      );
      expect(reviewerCreated).toBeTruthy();

      // Act
      const result = await createReviewerProcess.execute(domainOptions);

      // Assert
      expect(result.isErr()).toBeTruthy();
      // Add more assertions for the expected exception or error.
    });
  });
});
