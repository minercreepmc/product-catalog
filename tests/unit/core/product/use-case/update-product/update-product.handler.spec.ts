import { ProductUpdatedDomainEvent } from '@product-domain/domain-events';
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
  UpdateProductDomainOptions,
  UpdateProductResponseDto,
} from '@product-use-case/update-product/dtos';
import { ID } from 'common-base-classes';
import { DeepMockProxy, mock, mockDeep, MockProxy } from 'jest-mock-extended';

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
    const domainOptions: UpdateProductDomainOptions = {
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
        id: '123',
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
});
