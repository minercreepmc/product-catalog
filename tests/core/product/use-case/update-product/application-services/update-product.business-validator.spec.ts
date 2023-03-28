import { ProductDomainException } from '@product-domain/domain-exceptions';
import { ProductManagementDomainService } from '@product-domain/domain-services';
import {
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@product-domain/value-objects';
import { UpdateProductBusinessValidator } from '@product-use-case/update-product/application-services';
import { ID } from 'common-base-classes';
import { mock, MockProxy } from 'jest-mock-extended';

describe('UpdateProductBusinessValidator', () => {
  let validator: UpdateProductBusinessValidator;
  let productService: MockProxy<ProductManagementDomainService>;

  beforeEach(() => {
    productService = mock<ProductManagementDomainService>();
    validator = new UpdateProductBusinessValidator(productService);
  });

  describe('validate', () => {
    it('should validate successfully when name exists', async () => {
      // Arrange
      const domainOptions = {
        id: new ID('123'),
        payload: {
          name: new ProductNameValueObject('Product 1'),
          price: ProductPriceValueObject.create({
            amount: 10,
            currency: 'USD',
          }),
        },
      };

      productService.isProductExist.mockResolvedValueOnce(true);

      // Act
      const result = await validator.validate(domainOptions);

      // Assert
      expect(result.isValid).toBe(true);
      expect(result.exceptions.length).toBe(0);
    });

    it('should return validation exception when name does not exist', async () => {
      // Arrange
      const domainOptions = {
        id: new ID('123'),
        payload: {
          name: new ProductNameValueObject('Product 1'),
          price: ProductPriceValueObject.create({
            amount: 10,
            currency: 'USD',
          }),
        },
      };

      productService.isProductExist.mockResolvedValueOnce(false);

      // Act
      const result = await validator.validate(domainOptions);

      // Assert
      expect(result.isValid).toBe(false);
      expect(result.exceptions).toEqual(
        expect.arrayContaining([new ProductDomainException.IsNotExist()]),
      );
    });
  });
});
