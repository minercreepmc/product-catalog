import { ProductUpdatedDomainEvent } from '@product-domain/domain-events';
import { ProductDomainException } from '@product-domain/domain-exceptions';
import { ProductManagementDomainService } from '@product-domain/domain-services';
import {
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@product-domain/value-objects';
import { UpdateProductHandler } from '@product-use-case/update-product';
import {
  UpdateProductBusinessValidator,
  UpdateProductCommandValidator,
  UpdateProductMapper,
} from '@product-use-case/update-product/application-services';
import {
  UpdateProductCommand,
  UpdateProductResponseDto,
} from '@product-use-case/update-product/dtos';
import {
  ArgumentContainsEmptyStringException,
  ArgumentContainsNegativeException,
  ID,
  ValidationResponse,
} from 'common-base-classes';
import { DeepMockProxy, mock, mockDeep, MockProxy } from 'jest-mock-extended';
import { Err } from 'oxide.ts';

describe('UpdateProductHandler', () => {
  let updateProductHandler: UpdateProductHandler;
  let commandValidator: MockProxy<UpdateProductCommandValidator>;
  let businessValidator: MockProxy<UpdateProductBusinessValidator>;
  let mapper: DeepMockProxy<UpdateProductMapper>;
  let productManagementService: MockProxy<ProductManagementDomainService>;

  beforeEach(() => {
    commandValidator = mock<UpdateProductCommandValidator>();
    businessValidator = mock<UpdateProductBusinessValidator>();
    mapper = mockDeep<UpdateProductMapper>();
    productManagementService = mock<ProductManagementDomainService>();

    updateProductHandler = new UpdateProductHandler(
      commandValidator,
      businessValidator,
      mapper,
      productManagementService,
    );
    jest.clearAllMocks();
  });

  it('should successfully update a product', async () => {
    const command = new UpdateProductCommand({
      id: '123',
      name: 'test',
      price: {
        amount: 10,
        currency: 'USD',
      },
    });
    const productUpdated = new ProductUpdatedDomainEvent({
      productId: new ID('123'),
      details: {
        name: new ProductNameValueObject('test'),
        price: ProductPriceValueObject.create({
          amount: 10,
          currency: 'USD',
        }),
      },
    });
    const domainOptions = {
      id: new ID('123'),
      payload: {
        name: new ProductNameValueObject('test'),
        price: ProductPriceValueObject.create({
          amount: 10,
          currency: 'USD',
        }),
      },
    };

    commandValidator.validate.mockReturnValue({
      isValid: true,
      exceptions: [],
    });
    businessValidator.validate.mockResolvedValue({
      isValid: true,
      exceptions: [],
    });
    mapper.toDomain.mockReturnValue(domainOptions);

    productManagementService.updateProduct.mockResolvedValue(productUpdated);
    mapper.toResponseDto.mockReturnValue(
      new UpdateProductResponseDto({
        name: 'test',
        price: {
          amount: 10,
          currency: 'USD',
        },
      }),
    );

    const result = await updateProductHandler.execute(command);

    expect(commandValidator.validate).toHaveBeenCalledWith(command);
    expect(businessValidator.validate).toHaveBeenCalledWith(domainOptions);
    expect(mapper.toDomain).toHaveBeenCalledWith(command);
    expect(productManagementService.updateProduct).toHaveBeenCalledWith(
      domainOptions,
    );
    expect(mapper.toResponseDto).toHaveBeenCalledWith(productUpdated);
    expect(result.isOk()).toBe(true);
  });

  it('should throw a validation error if command validation fails', () => {
    const command = new UpdateProductCommand({
      id: '123',
      name: '',
      price: {
        amount: -1,
        currency: 'USD',
      },
    });
    const validationResult: ValidationResponse = ValidationResponse.fail([
      new ArgumentContainsEmptyStringException(),
      new ArgumentContainsNegativeException(),
    ]);

    commandValidator.validate.mockReturnValue(validationResult);

    expect(updateProductHandler.validateCommand(command)).toStrictEqual(
      Err(validationResult),
    );
  });

  it('should throw a validation error if business validation fails', async () => {
    const domainOptions = {
      id: new ID('123'),
      payload: {
        name: new ProductNameValueObject('test'),
        price: ProductPriceValueObject.create({
          amount: 10,
          currency: 'USD',
        }),
      },
    };
    const validationResult: ValidationResponse = ValidationResponse.fail([
      new ProductDomainException.IsExist(),
    ]);

    businessValidator.validate.mockResolvedValue(validationResult);

    expect(
      await updateProductHandler.validateBusinessOptions(domainOptions),
    ).toStrictEqual(Err(validationResult));
  });
});
