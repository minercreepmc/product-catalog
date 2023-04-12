import { ProductSubmittedDomainEvent } from '@domain-events/product';
import {
  ProductApprovalDomainService,
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { SubmitForApprovalProcess } from '@use-cases/submit-for-approval/application-services';
import { SubmitForApprovalDomainOptions } from '@use-cases/submit-for-approval/dtos';
import {
  moneyCurrencies,
  MoneyCurrencyEnum,
} from '@value-objects/common/money';
import {
  ProductIdValueObject,
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

describe('SubmitForApprovalProcess Integration Test', () => {
  let submitForApprovalProcess: SubmitForApprovalProcess;
  let productManagementService: ProductManagementDomainService;
  let reviewerManagementService: ReviewerManagementDomainService;
  let productApprovalService: ProductApprovalDomainService;

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

    submitForApprovalProcess = new SubmitForApprovalProcess(
      productManagementService,
      reviewerManagementService,
      productApprovalService,
    );
  });

  describe('execute', () => {
    it('should submit for approval when product and reviewer exist', async () => {
      // Arrange

      // Create a product and a reviewer with the given IDs in the database
      const productCreated = await productManagementService.createProduct({
        name: new ProductNameValueObject(faker.commerce.productName()),
        price: ProductPriceValueObject.create({
          amount: Number(faker.commerce.price()),
          currency: faker.helpers.arrayElement(moneyCurrencies),
        }),
      });
      const { productId } = productCreated;

      const reviewerCreated = await reviewerManagementService.createReviewer({
        email: new ReviewerEmailValueObject(
          faker.internet.email().toLowerCase(),
        ),
        name: new ReviewerNameValueObject(faker.name.firstName()),
        role: ReviewerRoleValueObject.createRegular(),
      });

      const { reviewerId } = reviewerCreated;
      // Use appropriate methods from productManagementService and reviewerManagementService
      // Ensure that the entities were created successfully

      const domainOptions: SubmitForApprovalDomainOptions = {
        productId,
        reviewerId,
      };

      // Act
      const result = await submitForApprovalProcess.execute(domainOptions);

      // Assert
      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toBeInstanceOf(ProductSubmittedDomainEvent);
      // Add more assertions for the successful submission, such as the state of the product or the approval record
    });

    it('should not submit for approval when product or reviewer does not exist', async () => {
      // Arrange
      const nonExistentProductId = new ProductIdValueObject(
        faker.datatype.uuid(),
      );
      const nonExistentReviewerId = new ReviewerIdValueObject(
        faker.datatype.uuid(),
      );

      const domainOptions: SubmitForApprovalDomainOptions = {
        productId: nonExistentProductId,
        reviewerId: nonExistentReviewerId,
      };

      // Act
      const result = await submitForApprovalProcess.execute(domainOptions);

      // Assert
      expect(result.isErr()).toBeTruthy();
      // Add more assertions for the expected exception or error
    });
  });
});
