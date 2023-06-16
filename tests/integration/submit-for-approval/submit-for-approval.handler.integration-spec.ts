import {
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import { SubmitForApprovalHandler } from '@use-cases/submit-for-approval';
import {
  SubmitForApprovalRequestDto,
  SubmitForApprovalResponseDto,
} from '@use-cases/submit-for-approval/dtos';
import {
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';
import { faker } from '@faker-js/faker';
import { moneyCurrencies } from '@value-objects/common/money';
import {
  ReviewerEmailValueObject,
  ReviewerNameValueObject,
  reviewerRoles,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';

describe('SubmitForApprovalHandler (integration test)', () => {
  let handler: SubmitForApprovalHandler;
  let productManagementService: ProductManagementDomainService;
  let reviewerManagementService: ReviewerManagementDomainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    handler = module.get<SubmitForApprovalHandler>(SubmitForApprovalHandler);
    productManagementService = module.get<ProductManagementDomainService>(
      ProductManagementDomainService,
    );
    reviewerManagementService = module.get<ReviewerManagementDomainService>(
      ReviewerManagementDomainService,
    );
  });

  // Test scenarios go here
  test('should return UseCaseCommandValidationExceptions when the command is invalid', async () => {
    // Arrange
    const command = new SubmitForApprovalRequestDto({
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

  test('should return UseCaseProcessExceptions when the process fails', async () => {
    // Arrange
    const command = new SubmitForApprovalRequestDto({
      productId: 'nonexistent-product-id',
      reviewerId: 'nonexistent-reviewer-id',
    });

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toBeInstanceOf(UseCaseProcessExceptions);
  });

  test('should return a valid SubmitForApprovalResult when the command is valid', async () => {
    // Arrange
    const { productId } = await productManagementService.createProduct({
      name: new ProductNameValueObject(faker.commerce.productName()),
      price: ProductPriceValueObject.create({
        amount: Number(faker.commerce.price()),
        currency: faker.helpers.arrayElement(moneyCurrencies),
      }),
    });
    const { reviewerId } = await reviewerManagementService.createReviewer({
      name: new ReviewerNameValueObject(faker.name.fullName()),
      email: new ReviewerEmailValueObject(faker.internet.email().toLowerCase()),
      role: new ReviewerRoleValueObject(
        faker.helpers.arrayElement(reviewerRoles),
      ),
    });

    const command = new SubmitForApprovalRequestDto({
      productId: productId.unpack(),
      reviewerId: reviewerId.unpack(),
    });

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(result.isOk()).toBeTruthy();
    expect(result.unwrap()).toBeInstanceOf(SubmitForApprovalResponseDto);
  });
});
