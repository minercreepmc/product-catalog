/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  ProductApprovalDomainService,
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { ApproveProductHandler } from '@use-cases/approve-product';
import {
  ApproveProductMapper,
  ApproveProductProcess,
  ApproveProductValidator,
} from '@use-cases/approve-product/application-services';
import {
  ApproveProductCommand,
  ApproveProductResponseDto,
} from '@use-cases/approve-product/dtos';
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
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';

describe('ApproveProductHandler Integration Test', () => {
  let handler: ApproveProductHandler;
  let validator: ApproveProductValidator;
  let mapper: ApproveProductMapper;
  let approveProductProcess: ApproveProductProcess;
  let productManagementService: ProductManagementDomainService;
  let reviewerManagementService: ReviewerManagementDomainService;
  let productApprovalService: ProductApprovalDomainService;
  let regularReviewerId: ReviewerIdValueObject;
  let adminReviewerId: ReviewerIdValueObject;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    validator = moduleFixture.get(ApproveProductValidator);
    mapper = moduleFixture.get(ApproveProductMapper);
    approveProductProcess = moduleFixture.get(ApproveProductProcess);
    productManagementService = moduleFixture.get(
      ProductManagementDomainService,
    );
    reviewerManagementService = moduleFixture.get(
      ReviewerManagementDomainService,
    );
    productApprovalService = moduleFixture.get(ProductApprovalDomainService);

    handler = new ApproveProductHandler(
      validator,
      mapper,
      approveProductProcess,
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

    const adminReviewerCreated = await reviewerManagementService.createReviewer(
      {
        email: new ReviewerEmailValueObject(
          faker.internet.email().toLowerCase(),
        ),
        name: new ReviewerNameValueObject(faker.name.firstName()),
        role: ReviewerRoleValueObject.createAdmin(),
      },
    );

    if (adminReviewerCreated) {
      const { reviewerId } = adminReviewerCreated;
      adminReviewerId = reviewerId;
    }
  });

  describe('execute', () => {
    it('should approve a product when all conditions are met', async () => {
      // Add necessary setup for creating a product and reviewer with the given IDs
      const { productId } = await productManagementService.createProduct({
        name: new ProductNameValueObject(faker.commerce.productName()),
        price: ProductPriceValueObject.create({
          amount: Number(faker.commerce.price()),
          currency: faker.helpers.arrayElement(moneyCurrencies),
        }),
      });

      await productApprovalService.submitForApproval({
        productId,
        reviewerId: regularReviewerId,
      });

      // Arrange
      const command = new ApproveProductCommand({
        productId: productId.unpack(),
        reviewerId: adminReviewerId.unpack(),
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isOk()).toBeTruthy();
      expect(result.unwrap()).toBeInstanceOf(ApproveProductResponseDto);
      // Add more assertions for the approved product's properties, such as status or approval date
    });

    it('should not approve a product when the product does not exist', async () => {
      // Arrange
      const command = new ApproveProductCommand({
        productId: 'nonexistent_product_id',
        reviewerId: adminReviewerId.unpack(),
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isErr()).toBeTruthy();
      expect(result.unwrapErr()).toBeInstanceOf(UseCaseProcessExceptions);
      // Add more assertions for the expected exception or error
    });

    it('should not approve a product if command is not valid', async () => {
      // Arrange
      const command = new ApproveProductCommand({
        productId: '',
        reviewerId: '',
      });

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isErr()).toBeTruthy();
      expect(result.unwrapErr()).toBeInstanceOf(
        UseCaseCommandValidationExceptions,
      );
    });

    // Add more test cases for other scenarios
  });
});
