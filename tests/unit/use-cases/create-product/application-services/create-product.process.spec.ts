import { ProductCreatedDomainEvent } from '@domain-events/product';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ProductManagementDomainService } from '@domain-services';
import { CreateProductProcess } from '@use-cases/create-product/application-services';
import { CreateProductDomainOptions } from '@use-cases/create-product/dtos';
import {
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';
import { mock, MockProxy } from 'jest-mock-extended';

describe('CreateProductProcess', () => {
  let createProductProcess: CreateProductProcess;
  let productManagementService: MockProxy<ProductManagementDomainService>;

  beforeEach(() => {
    productManagementService = mock<ProductManagementDomainService>();
    createProductProcess = new CreateProductProcess(productManagementService);
  });

  describe('validateNameMustNotExist', () => {
    it('should not throw an exception when the name does not exist', async () => {
      // Arrange
      const name = new ProductNameValueObject('nonexistent_name');
      productManagementService.isProductExistByName.mockResolvedValue(false);

      // Act
      await (createProductProcess as any).validateNameMustNotExist(name);

      // Assert
      expect(createProductProcess.exceptions.length).toBe(0);
    });

    it('should throw an exception when the name exists', async () => {
      // Arrange
      const name = new ProductNameValueObject('existing_name');
      productManagementService.isProductExistByName.mockResolvedValue(true);

      // Act
      await (createProductProcess as any).validateNameMustNotExist(name);

      // Assert
      expect(createProductProcess.exceptions).toIncludeAllMembers([
        new ProductDomainExceptions.DoesExist(),
      ]);
    });
  });

  describe('createProductIfNameNotExist', () => {
    it('should create a product when the name does not exist', async () => {
      // Arrange
      const domainOptions = {
        /* your CreateProductDomainOptions object */
      };
      (createProductProcess as any).nameExist = false;
      productManagementService.createProduct.mockResolvedValue(
        new ProductCreatedDomainEvent({
          productId: new ProductIdValueObject('123'),
          details: {
            name: new ProductNameValueObject('Product 1'),
            price: ProductPriceValueObject.create({
              amount: 10,
              currency: 'USD',
            }),
          },
        }),
      );

      // Act
      await (createProductProcess as any).createProductIfNameNotExist(
        domainOptions,
      );

      // Assert
      expect(productManagementService.createProduct).toHaveBeenCalled();
    });

    it('should not create a product when the name exists', async () => {
      // Arrange
      const domainOptions: CreateProductDomainOptions = {
        name: new ProductNameValueObject('Product 1'),
        price: ProductPriceValueObject.create({
          amount: 10,
          currency: 'USD',
        }),
      };
      (createProductProcess as any).nameExist = true;
      productManagementService.createProduct.mockRejectedValue(
        ProductDomainExceptions.DoesExist,
      );

      // Act
      await (createProductProcess as any).createProductIfNameNotExist(
        domainOptions,
      );

      // Assert
      expect(productManagementService.createProduct).not.toHaveBeenCalled();
    });
  });
});
