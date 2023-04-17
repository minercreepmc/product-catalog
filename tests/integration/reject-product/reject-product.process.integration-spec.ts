/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ProductApprovalDomainService,
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { RejectProductProcess } from '@use-cases/reject-product/application-services';
import { RejectProductDomainOptions } from '@use-cases/reject-product/dtos';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';
import { faker } from '@faker-js/faker';
import {
  ProductNameValueObject,
  ProductPriceValueObject,
  RejectionReasonValueObject,
} from '@value-objects/product';
import { moneyCurrencies } from '@value-objects/common/money';
import { ProductRejectedDomainEvent } from '@domain-events/product';

describe('RejectProductProcess Integration Test', () => {
  let rejectProductProcess: RejectProductProcess;
  let productManagementService: ProductManagementDomainService;
  let reviewerManagementService: ReviewerManagementDomainService;
  let productApprovalService: ProductApprovalDomainService;

  let regularReviewerId: ReviewerIdValueObject;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    productManagementService = moduleFixture.get(
      ProductManagementDomainService,
    );
    reviewerManagementService = moduleFixture.get(
      ReviewerManagementDomainService,
    );
    productApprovalService = moduleFixture.get(ProductApprovalDomainService);
    rejectProductProcess = new RejectProductProcess(
      productManagementService,
      reviewerManagementService,
      productApprovalService,
    );

    // You can reuse the same setup as in the ApproveProductProcess test
    const regularReviewerCreated =
      await reviewerManagementService.createReviewer({
        email: new ReviewerEmailValueObject(
          faker.internet.email().toLowerCase(),
        ),
        name: new ReviewerNameValueObject(faker.name.firstName()),
        role: ReviewerRoleValueObject.createRegular(),
      });

    if (regularReviewerCreated) {
      const { reviewerId } = regularReviewerCreated;
      regularReviewerId = reviewerId;
    }
  });

  describe('execute', () => {
    it('should reject a product when the product is submitted for approval and the reviewer is admin', async () => {
      // Arrange
      const { productId } = await productManagementService.createProduct({
        name: new ProductNameValueObject(faker.commerce.productName()),
        price: ProductPriceValueObject.create({
          currency: faker.helpers.arrayElement(moneyCurrencies),
          amount: Number(faker.commerce.price()),
        }),
      });

      await productApprovalService.submitForApproval({
        productId,
        reviewerId: regularReviewerId,
      });

      // Create an admin reviewer
      const { reviewerId: adminReviewerId } =
        await reviewerManagementService.createReviewer({
          email: new ReviewerEmailValueObject(
            faker.internet.email().toLowerCase(),
          ),
          name: new ReviewerNameValueObject(faker.name.firstName()),
          role: ReviewerRoleValueObject.createAdmin(),
        });

      // Act
      const domainOptions: RejectProductDomainOptions = {
        productId,
        reviewerId: adminReviewerId,
        reason: new RejectionReasonValueObject(faker.lorem.sentence()),
      };
      const result = await rejectProductProcess.execute(domainOptions);

      // Assert
      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toBeInstanceOf(ProductRejectedDomainEvent);
      // Add more assertions for the rejected product's properties or domain events.
    });

    it('should not reject a product when the product is not submitted for approval or the reviewer is not admin', async () => {
      // Arrange
      // Create a product that is not submitted for approval
      const { productId } = await productManagementService.createProduct({
        name: new ProductNameValueObject(faker.commerce.productName()),
        price: ProductPriceValueObject.create({
          currency: faker.helpers.arrayElement(moneyCurrencies),
          amount: Number(faker.commerce.price()),
        }),
      });
      // Create a non-admin reviewer
      const { reviewerId: nonAdminReviewerId } =
        await reviewerManagementService.createReviewer({
          email: new ReviewerEmailValueObject(
            faker.internet.email().toLowerCase(),
          ),
          name: new ReviewerNameValueObject(faker.name.firstName()),
          role: ReviewerRoleValueObject.createRegular(),
        });

      // Act
      const domainOptions: RejectProductDomainOptions = {
        productId,
        reviewerId: nonAdminReviewerId,
        reason: new RejectionReasonValueObject(faker.lorem.sentence()),
      };
      const result = await rejectProductProcess.execute(domainOptions);

      // Assert
      expect(result.isErr()).toBeTruthy();
      // Add more assertions for the expected exception or error.
    });
  });
});
