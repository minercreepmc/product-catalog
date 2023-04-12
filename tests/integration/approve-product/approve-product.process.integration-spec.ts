import {
  ProductApprovalDomainService,
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { ApproveProductProcess } from '@use-cases/approve-product/application-services';
import { ApproveProductDomainOptions } from '@use-cases/approve-product/dtos';
import {
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';
import { faker } from '@faker-js/faker';
import { moneyCurrencies } from '@value-objects/common/money';
import { ProductApprovedDomainEvent } from '@domain-events/product';

describe('ApproveProductProcess Integration Test', () => {
  let approveProductProcess: ApproveProductProcess;
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
    approveProductProcess = new ApproveProductProcess(
      productManagementService,
      reviewerManagementService,
      productApprovalService,
    );

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
    it('should approve a product when the product is submitted for approval and the reviewer is admin', async () => {
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

      const domainOptions: ApproveProductDomainOptions = {
        productId,
        reviewerId: adminReviewerId,
      };

      // Act
      const result = await approveProductProcess.execute(domainOptions);

      // Assert
      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toBeInstanceOf(ProductApprovedDomainEvent);
      // Add more assertions for the approved product's properties or domain events.
    });

    it('should not approve a product when the product is not submitted for approval or the reviewer is not admin', async () => {
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

      const domainOptions: ApproveProductDomainOptions = {
        productId,
        reviewerId: nonAdminReviewerId,
      };

      // Act
      const result = await approveProductProcess.execute(domainOptions);

      // Assert
      expect(result.isErr()).toBeTruthy();
      // Add more assertions for the expected exception or error.
    });
  });
});
