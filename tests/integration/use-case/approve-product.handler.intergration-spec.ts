import { ProductApprovedDomainEvent } from '@domain-events/product';
import { ProductApprovalDomainService } from '@domain-services';
import { ApproveProductHandler } from '@use-cases/approve-product';
import {
  ApproveProductBusinessValidator,
  ApproveProductCommandValidator,
  ApproveProductMapper,
} from '@use-cases/approve-product/application-services';
import {
  ApproveProductCommand,
  ApproveProductDomainOptions,
  ApproveProductResponseDto,
} from '@use-cases/approve-product/dtos';
import {
  ProductIdValueObject,
  ProductStatusEnum,
  ProductStatusValueObject,
} from '@value-objects/product';
import { ReviewerIdValueObject } from '@value-objects/reviewer';
import { ValidationResponse } from 'common-base-classes';
import { mock } from 'jest-mock-extended';

// Mock the dependencies
const commandValidatorMock = mock<ApproveProductCommandValidator>();
const mapperMock = mock<ApproveProductMapper>();
const businessValidatorMock = mock<ApproveProductBusinessValidator>();
const domainServiceMock = mock<ProductApprovalDomainService>();

describe('ApproveProductHandler', () => {
  let handler: ApproveProductHandler;

  beforeEach(() => {
    handler = new ApproveProductHandler(
      commandValidatorMock,
      mapperMock,
      businessValidatorMock,
      domainServiceMock,
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('execute should return Ok with response DTO when command, business validation and domain service succeed', async () => {
    const productId = '1';
    const reviewerId = '2';
    const productStatus = ProductStatusEnum.APPROVED;
    const command = new ApproveProductCommand({
      productId,
      reviewerId,
    });
    const domainOptions: ApproveProductDomainOptions = {
      productId: new ProductIdValueObject(productId),
      reviewerId: new ReviewerIdValueObject(reviewerId),
    };
    const productApprovedEvent = new ProductApprovedDomainEvent({
      productId: new ProductIdValueObject(productId),
      details: {
        reviewerId: new ReviewerIdValueObject(reviewerId),
        status: new ProductStatusValueObject(productStatus),
      },
    });
    const responseDto = new ApproveProductResponseDto({
      reviewerId: reviewerId,
      productId: productId,
      productStatus: productStatus,
    });

    commandValidatorMock.validate.mockReturnValue(ValidationResponse.success());
    mapperMock.toDomain.mockReturnValue(domainOptions);
    businessValidatorMock.validate.mockResolvedValue(
      ValidationResponse.success(),
    );
    domainServiceMock.approveProduct.mockResolvedValue(productApprovedEvent);
    mapperMock.toResponseDto.mockReturnValue(responseDto);

    const result = await handler.execute(command);

    expect(result.isOk()).toBe(true);
    expect(result.unwrap()).toBe(responseDto);
  });

  // Additional test cases for command validation, business validation, and domain service failures can be added here
});
