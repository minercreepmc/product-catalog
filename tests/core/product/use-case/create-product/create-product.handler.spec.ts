import { ProductCreatedDomainEvent } from '@product-domain/domain-events';
import { ProductManagementDomainService } from '@product-domain/domain-services';
import {
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@product-domain/value-objects';
import { CreateProductHandler } from '@product-use-case/create-product';
import {
  CreateProductBusinessValidator,
  CreateProductCommandValidator,
  CreateProductMapper,
} from '@product-use-case/create-product/application-services';
import {
  CreateProductCommand,
  CreateProductResponseDto,
} from '@product-use-case/create-product/dtos';
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
