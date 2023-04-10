import { ProductUpdatedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ProductManagementDomainService } from '@domain-services';
import { UpdateProductProcess } from '@use-cases/update-product/application-services';
import { UpdateProductDomainOptions } from '@use-cases/update-product/dtos';
import {
  ProductIdValueObject,
  ProductNameValueObject,
} from '@value-objects/product';
import { mock, MockProxy } from 'jest-mock-extended';

describe('UpdateProductProcess', () => {
  let updateProductProcess: UpdateProductProcess;
  let productManagementService: MockProxy<ProductManagementDomainService>;

  beforeEach(() => {
    productManagementService = mock<ProductManagementDomainService>();
    updateProductProcess = new UpdateProductProcess(productManagementService);
  });

  it('should successfully update the product', async () => {
    const mockOptions: UpdateProductDomainOptions = {
      id: new ProductIdValueObject('123'),
      payload: {
        name: new ProductNameValueObject('Product 1'),
      },
    };
    const productUpdatedEvent = new ProductUpdatedDomainEvent({
      productId: new ProductIdValueObject('123'),
      details: {
        name: new ProductNameValueObject('Product 1'),
      },
    });

    productManagementService.isProductExistById.mockResolvedValue(true);
    productManagementService.updateProduct.mockResolvedValue(
      productUpdatedEvent,
    );

    const result = await updateProductProcess.execute(mockOptions);

    expect(result.isOk()).toBeTruthy();
    expect(result.unwrap()).toBe(productUpdatedEvent);
  });

  it('should fail to update the product if product does not exist', async () => {
    const mockOptions: UpdateProductDomainOptions = {
      id: new ProductIdValueObject('not_exist'),
      payload: {
        name: new ProductNameValueObject('Product 1'),
      },
    };

    productManagementService.isProductExistById.mockResolvedValue(false);

    const result = await updateProductProcess.execute(mockOptions);

    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toContainEqual(
      new ProductDomainExceptions.DoesNotExist(),
    );
  });
});
