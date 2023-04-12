import { ProductAggregate } from '@aggregates/product';
import { ReviewerAggregate } from '@aggregates/reviewer';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ReviewerDomainExceptions } from '@domain-exceptions/reviewer';
import {
  ProductApprovalDomainService,
  ProductManagementDomainService,
  ReviewerManagementDomainService,
} from '@domain-services';
import { ApproveProductProcess } from '@use-cases/approve-product/application-services';
import { ApproveProductDomainOptions } from '@use-cases/approve-product/dtos';
import {
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
  ProductStatusValueObject,
} from '@value-objects/product';
import {
  ReviewerEmailValueObject,
  ReviewerIdValueObject,
  ReviewerNameValueObject,
  ReviewerRoleValueObject,
} from '@value-objects/reviewer';
import { mock } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';
import { moneyCurrencies } from '@value-objects/common/money';
import { ProductApprovedDomainEvent } from '@domain-events/product';

describe('ApproveProductProcess', () => {
  let approveProductProcess: ApproveProductProcess;
  const productManagementService = mock<ProductManagementDomainService>();
  const reviewerManagementService = mock<ReviewerManagementDomainService>();
  const productApprovalService = mock<ProductApprovalDomainService>();

  beforeEach(() => {
    approveProductProcess = new ApproveProductProcess(
      productManagementService,
      reviewerManagementService,
      productApprovalService,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should not approve a product if the product does not exist', async () => {
    const domainOptions: ApproveProductDomainOptions = {
      productId: new ProductIdValueObject('nonexistent_product_id'),
      reviewerId: new ReviewerIdValueObject('reviewer_id'),
    };

    productManagementService.getProductById.mockResolvedValue(null);
    reviewerManagementService.getReviewerById.mockResolvedValue(
      new ReviewerAggregate(),
    );

    const result = await approveProductProcess.execute(domainOptions);

    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toEqual([
      new ProductDomainExceptions.DoesNotExist(),
    ]);
  });

  it('should not approve a product if the reviewer does not exist', async () => {
    const domainOptions: ApproveProductDomainOptions = {
      productId: new ProductIdValueObject('product_id'),
      reviewerId: new ReviewerIdValueObject('nonexistent_reviewer_id'),
    };

    productManagementService.getProductById.mockResolvedValue(
      new ProductAggregate(),
    );
    reviewerManagementService.getReviewerById.mockResolvedValue(null);

    const result = await approveProductProcess.execute(domainOptions);

    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toEqual([
      new ReviewerDomainExceptions.DoesNotExist(),
    ]);
  });

  it('should not approve a product if the reviewer is not an admin', async () => {
    const domainOptions: ApproveProductDomainOptions = {
      productId: new ProductIdValueObject('product_id'),
      reviewerId: new ReviewerIdValueObject('reviewer_id'),
    };

    const nonAdminReviewer = new ReviewerAggregate({
      details: {
        name: new ReviewerNameValueObject(faker.name.firstName()),
        email: new ReviewerEmailValueObject(
          faker.internet.email().toLowerCase(),
        ),
        role: ReviewerRoleValueObject.createRegular(),
      },
    });

    productManagementService.getProductById.mockResolvedValue(
      new ProductAggregate(),
    );
    reviewerManagementService.getReviewerById.mockResolvedValue(
      nonAdminReviewer,
    );

    const result = await approveProductProcess.execute(domainOptions);

    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toIncludeAllMembers([
      new ReviewerDomainExceptions.NotAuthorizedToApprove(),
    ]);
  });

  it('should not approve a product if the product is not submitted for approval', async () => {
    const domainOptions: ApproveProductDomainOptions = {
      productId: new ProductIdValueObject('product_id'),
      reviewerId: new ReviewerIdValueObject('reviewer_id'),
    };

    const adminReviewer = new ReviewerAggregate({
      details: {
        name: new ReviewerNameValueObject(faker.name.firstName()),
        email: new ReviewerEmailValueObject(
          faker.internet.email().toLowerCase(),
        ),
        role: ReviewerRoleValueObject.createAdmin(),
      },
    });

    const notSubmittedProduct = new ProductAggregate({
      details: {
        name: new ProductNameValueObject(faker.commerce.productName()),
        price: ProductPriceValueObject.create({
          amount: Number(faker.commerce.price()),
          currency: faker.helpers.arrayElement(moneyCurrencies),
        }),
        status: ProductStatusValueObject.createDraft(),
      },
    });

    productManagementService.getProductById.mockResolvedValue(
      notSubmittedProduct,
    );
    reviewerManagementService.getReviewerById.mockResolvedValue(adminReviewer);

    const result = await approveProductProcess.execute(domainOptions);

    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toEqual([
      new ProductDomainExceptions.NotSubmittedForApproval(),
    ]);
  });

  it('should approve a product if the product is submitted for approval and the reviewer is an admin', async () => {
    const domainOptions: ApproveProductDomainOptions = {
      productId: new ProductIdValueObject('product_id'),
      reviewerId: new ReviewerIdValueObject('reviewer_id'),
    };

    const adminReviewer = new ReviewerAggregate({
      details: {
        name: new ReviewerNameValueObject(faker.name.firstName()),
        email: new ReviewerEmailValueObject(
          faker.internet.email().toLowerCase(),
        ),
        role: ReviewerRoleValueObject.createAdmin(),
      },
    });

    const submittedProduct = new ProductAggregate({
      details: {
        name: new ProductNameValueObject(faker.commerce.productName()),
        price: ProductPriceValueObject.create({
          amount: Number(faker.commerce.price()),
          currency: faker.helpers.arrayElement(moneyCurrencies),
        }),
        status: ProductStatusValueObject.createPending(),
      },
    });

    productManagementService.getProductById.mockResolvedValue(submittedProduct);
    reviewerManagementService.getReviewerById.mockResolvedValue(adminReviewer);

    const productApprovedEvent = new ProductApprovedDomainEvent({
      productId: new ProductIdValueObject('product_id'),
      details: {
        reviewerId: new ReviewerIdValueObject('reviewer_id'),
        productStatus: ProductStatusValueObject.createApproved(),
      },
    });
    productApprovalService.approveProduct.mockResolvedValue(
      productApprovedEvent,
    );

    const result = await approveProductProcess.execute(domainOptions);

    expect(result.isOk()).toBeTruthy();
    expect(result.unwrap()).toBe(productApprovedEvent);
  });
});
