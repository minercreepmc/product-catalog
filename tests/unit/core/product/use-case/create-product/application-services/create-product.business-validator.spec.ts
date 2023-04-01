import { ProductDomainException } from '@product-domain/domain-exceptions';
import { ProductManagementDomainService } from '@product-domain/domain-services';
import {
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@product-domain/value-objects';
import { CreateProductBusinessValidator } from '@product-use-case/create-product/application-services';
import { CreateProductDomainOptions } from '@product-use-case/create-product/dtos';
import { mock, MockProxy } from 'jest-mock-extended';

describe('CreateProductBusinessValidator', () => {
  let validator: CreateProductBusinessValidator;
  let productManagementService: MockProxy<ProductManagementDomainService>;

  beforeEach(() => {
    productManagementService = mock<ProductManagementDomainService>();

    validator = new CreateProductBusinessValidator(productManagementService);
    jest.resetAllMocks();
  });

  describe('validate', () => {
    it('should return a successful ValidationResponse if product name does not exist', async () => {
      const name = new ProductNameValueObject('Valid Name');
      const price = ProductPriceValueObject.create({
        amount: 100,
        currency: 'USD',
      });
      const domainOptions: CreateProductDomainOptions = { name, price };

      productManagementService.isProductNameExist.mockResolvedValue(false);

      const validationResult = await validator.validate(domainOptions);

      expect(validationResult.isValid).toBe(true);
      expect(validationResult.exceptions.length).toBe(0);
    });

    it('should return a failed ValidationResponse with an exception if product name exists', async () => {
      const name = new ProductNameValueObject('Valid Name');
      const price = ProductPriceValueObject.create({
        amount: 100,
        currency: 'USD',
      });
      const domainOptions: CreateProductDomainOptions = { name, price };

      productManagementService.isProductNameExist.mockResolvedValue(true);

      const validationResult = await validator.validate(domainOptions);

      expect(validationResult.isValid).toBe(false);
      expect(validationResult.exceptions.length).toBe(1);
      expect(validationResult.exceptions[0]).toBeInstanceOf(
        ProductDomainException.IsExist,
      );
    });
  });
});
