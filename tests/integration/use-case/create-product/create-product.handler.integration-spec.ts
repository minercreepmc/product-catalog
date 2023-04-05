import { ProductCreatedDomainEvent } from '@domain-events/product';
import { ProductManagementDomainService } from '@domain-services';
import { CreateProductHandler } from '@use-cases/create-product';
import {
  CreateProductBusinessValidator,
  CreateProductCommandValidator,
  CreateProductMapper,
} from '@use-cases/create-product/application-services';
import {
  CreateProductCommand,
  CreateProductResponseDto,
} from '@use-cases/create-product/dtos';
import {
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';
import { mock, MockProxy } from 'jest-mock-extended';

describe('CreateProductHandler', () => {
  let handler: CreateProductHandler;
  let commandValidator: MockProxy<CreateProductCommandValidator>;
  let businessValidator: MockProxy<CreateProductBusinessValidator>;
  let mapper: MockProxy<CreateProductMapper>;
  let productManagementService: MockProxy<ProductManagementDomainService>;
  let testName: string;
  let testPrice: {
    amount: number;
    currency: string;
  };
  let testId: string;

  beforeEach(() => {
    commandValidator = mock<CreateProductCommandValidator>();
    businessValidator = mock<CreateProductBusinessValidator>();
    mapper = mock<CreateProductMapper>();
    productManagementService = mock<ProductManagementDomainService>();

    handler = new CreateProductHandler(
      commandValidator,
      businessValidator,
      mapper,
      productManagementService,
    );
    testName = 'testName';
    testPrice = {
      amount: 100,
      currency: 'USD',
    };
    testId = '123';
  });

  it('should execute with valid command and return the expected result', async () => {
    // Prepare test data and mocks
    const command = new CreateProductCommand({
      name: testName,
      price: testPrice,
    });
    commandValidator.validate.mockReturnValue({
      isValid: true,
      exceptions: [],
    });
    mapper.toDomain.mockReturnValue({
      name: new ProductNameValueObject(testName),
      price: ProductPriceValueObject.create(testPrice),
    });
    businessValidator.validate.mockResolvedValue({
      isValid: true,
      exceptions: [],
    });

    const responseDto = new CreateProductResponseDto({
      productId: testId,
      name: testName,
      price: testPrice,
    });
    mapper.toResponseDto.mockReturnValue(responseDto);
    productManagementService.createProduct.mockResolvedValue(
      new ProductCreatedDomainEvent({
        productId: new ProductIdValueObject(),
        details: {
          name: new ProductNameValueObject(testName),
          price: ProductPriceValueObject.create(testPrice),
        },
      }),
    );

    // Execute the method
    const result = await handler.execute(command);

    // Check the result
    expect(result.unwrap()).toEqual(responseDto);
  });
});
