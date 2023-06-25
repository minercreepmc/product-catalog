import {
  ProductApprovalDomainService,
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { RejectProductHandler } from '@use-cases/reject-product';
import {
  RejectProductMapper,
  RejectProductProcess,
  RejectProductRequestValidator,
} from '@use-cases/reject-product/application-services';
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
} from '@value-objects/product';
import {
  RejectProductRequestDto,
  RejectProductResponseDto,
} from '@use-cases/reject-product/dtos';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import { moneyCurrencies } from '@value-objects/common/money';

describe('RejectProductHandler Integration Test', () => {
  let handler: RejectProductHandler;
  let validator: RejectProductRequestValidator;
  let mapper: RejectProductMapper;
  let approveProductProcess: RejectProductProcess;
  let productManagementService: ProductManagementDomainService;
  let reviewerManagementService: ReviewerManagementDomainService;
  let productApprovalService: ProductApprovalDomainService;
  let regularReviewerId: ReviewerIdValueObject;
  let adminReviewerId: ReviewerIdValueObject;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    validator = moduleFixture.get(RejectProductRequestValidator);
    mapper = moduleFixture.get(RejectProductMapper);
    approveProductProcess = moduleFixture.get(RejectProductProcess);
    productManagementService = moduleFixture.get(
      ProductManagementDomainService,
    );
    reviewerManagementService = moduleFixture.get(
      ReviewerManagementDomainService,
    );
    productApprovalService = moduleFixture.get(ProductApprovalDomainService);

    handler = new RejectProductHandler(
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
    it('should not approve a product if command is not valid', async () => {
      // Arrange
      const command: RejectProductRequestDto = {
        reviewerId: '',
        reason: '',
        productId: '123',
      };

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(
        UseCaseCommandValidationExceptions,
      );
    });

    it('should not approve a product if process fails', async () => {
      // Arrange
      const command: RejectProductRequestDto = {
        reviewerId: regularReviewerId.unpack(),
        reason: 'some reason',
        productId: 'non-existing-product-id',
      };

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isErr()).toBe(true);
      expect(result.unwrapErr()).toBeInstanceOf(UseCaseProcessExceptions);
    });

    it('should reject a product', async () => {
      // Arrange
      const { productId } = await productManagementService.createProduct({
        name: new ProductNameValueObject(faker.name.firstName()),
        price: ProductPriceValueObject.create({
          amount: faker.datatype.number(),
          currency: faker.helpers.arrayElement(moneyCurrencies),
        }),
      });

      await productApprovalService.submitForApproval({
        productId,
        reviewerId: regularReviewerId,
      });

      const command: RejectProductRequestDto = {
        reviewerId: adminReviewerId.unpack(),
        reason: 'some reason',
        productId: productId.unpack(),
      };

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isOk()).toBe(true);
      expect(result.unwrap()).toBeInstanceOf(RejectProductResponseDto);
    });
  });
});
