import { ReviewerAggregate } from '@aggregates/reviewer';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import {
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { ApproveProductBusinessValidator } from '@use-cases/approve-product/application-services';
import { ProductIdValueObject } from '@value-objects/product';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';
import { mock } from 'jest-mock-extended';

// Mock the services
const productManagementServiceMock = mock<ProductManagementDomainService>();
const reviewerManagementServiceMock = mock<ReviewerManagementDomainService>();

describe('ApproveProductBusinessValidator', () => {
  let validator: ApproveProductBusinessValidator;
  let normalReviewer: ReviewerAggregate;
  let adminReviewer: ReviewerAggregate;
  const adminRole = new ReviewerRoleValueObject('admin');
  const regularRole = new ReviewerRoleValueObject('regular');
  beforeEach(() => {
    validator = new ApproveProductBusinessValidator(
      productManagementServiceMock,
      reviewerManagementServiceMock,
    );

    normalReviewer = new ReviewerAggregate({
      details: {
        name: new ReviewerNameValueObject('John Doe'),
        email: new ReviewerEmailValueObject('johndoe@example.com'),
        role: regularRole,
      },
    });

    adminReviewer = new ReviewerAggregate({
      details: {
        name: new ReviewerNameValueObject('John'),
        email: new ReviewerEmailValueObject('johne@ample.com'),
        role: adminRole,
      },
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('validate should return valid response when product and reviewer exist and reviewer is admin', async () => {
    const productId = new ProductIdValueObject('1');
    const reviewerId = new ReviewerIdValueObject('2');

    productManagementServiceMock.isProductExistById.mockResolvedValue(true);
    reviewerManagementServiceMock.isReviewerExistById.mockResolvedValue(true);
    reviewerManagementServiceMock.getReviewerById.mockResolvedValue(
      adminReviewer,
    );

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
    reviewerManagementServiceMock.getReviewerById.mockResolvedValue(
      adminReviewer,
    );

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

  test('validate should return invalid response when reviewer is not an admin', async () => {
    const productId = new ProductIdValueObject('1');
    const reviewerId = new ReviewerIdValueObject('2');

    productManagementServiceMock.isProductExistById.mockResolvedValue(true);
    reviewerManagementServiceMock.isReviewerExistById.mockResolvedValue(true);
    reviewerManagementServiceMock.getReviewerById.mockResolvedValue(
      normalReviewer,
    );

    const validationResult = await validator.validate({
      productId,
      reviewerId,
    });

    expect(validationResult.exceptions).toIncludeAllMembers([
      new ReviewerDomainExceptions.NotAuthorizedToApprove(),
    ]);
  });
});
