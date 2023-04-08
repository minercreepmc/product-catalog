import {
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { ApproveProductBusinessValidator } from '@use-cases/approve-product/application-services';
import { ProductIdValueObject } from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { mock } from 'jest-mock-extended';

// Mock the services
const productManagementServiceMock = mock<ProductManagementDomainService>();
const reviewerManagementServiceMock = mock<ReviewerManagementDomainService>();

describe('ApproveProductBusinessValidator', () => {
  let validator: ApproveProductBusinessValidator;

  beforeEach(() => {
    validator = new ApproveProductBusinessValidator(
      productManagementServiceMock,
      reviewerManagementServiceMock,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('validate should return valid response when product and reviewer exist', async () => {
    const productId = new ProductIdValueObject('1');
    const reviewerId = new ReviewerIdValueObject('2');

    productManagementServiceMock.isProductExistById.mockResolvedValue(true);
    reviewerManagementServiceMock.isReviewerExistById.mockResolvedValue(true);

    const validationResult = await validator.validate({
      productId,
      reviewerId,
    });

    expect(validationResult.isValid).toBe(true);
    expect(validationResult.exceptions).toHaveLength(0);
  });

  test('validate should return invalid response when product does not exist', async () => {
    const productId = new ProductIdValueObject('1');
    const reviewerId = new ReviewerIdValueObject('2');

    productManagementServiceMock.isProductExistById.mockResolvedValue(false);
    reviewerManagementServiceMock.isReviewerExistById.mockResolvedValue(true);

    const validationResult = await validator.validate({
      productId,
      reviewerId,
    });

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.exceptions).toHaveLength(1);
  });

  test('validate should return invalid response when reviewer does not exist', async () => {
    const productId = new ProductIdValueObject('1');
    const reviewerId = new ReviewerIdValueObject('2');

    productManagementServiceMock.isProductExistById.mockResolvedValue(true);
    reviewerManagementServiceMock.isReviewerExistById.mockResolvedValue(false);

    const validationResult = await validator.validate({
      productId,
      reviewerId,
    });

    expect(validationResult.isValid).toBe(false);
    expect(validationResult.exceptions).toHaveLength(1);
  });
});
