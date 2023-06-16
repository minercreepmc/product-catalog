import { ProductDomainExceptions } from '@domain-exceptions/product';
import { CreateProductValidator } from '@use-cases/create-product/application-services';
import { CreateProductRequestDto } from '@use-cases/create-product/dtos';

describe('CreateProductValidator', () => {
  let validator: CreateProductValidator;

  beforeEach(() => {
    validator = new CreateProductValidator();
  });

  describe('validate', () => {
    it('should return a success validation response when the command is valid', () => {
      const command = new CreateProductRequestDto({
        name: 'Valid Name',
        price: {
          amount: 100,
          currency: 'USD',
        },
        description: 'Valid Description',
        image: 'https://example.com/image.png',
      });
      const validationResult = validator.validate(command);
      expect(validationResult.isValid).toBe(true);
    });

    it('should return a failed validation response when the command is invalid', () => {
      const command = new CreateProductRequestDto({
        name: '',
        price: {
          amount: -1,
          currency: 'USD',
        },
        description: '',
        image: 'wtf',
      });
      const validationResult = validator.validate(command);
      expect(validationResult.isValid).toBe(false);
      expect(validationResult.exceptions).toIncludeAllMembers([
        new ProductDomainExceptions.NameDoesNotValid(),
        new ProductDomainExceptions.PriceDoesNotValid(),
        new ProductDomainExceptions.DescriptionDoesNotValid(),
        new ProductDomainExceptions.ImageDoesNotValid(),
      ]);
    });

    it('should clear exceptions after multiple calls to validate', () => {
      const validName = 'Valid Name';
      const invalidName = '';
      const validPrice = { amount: 100, currency: 'USD' };
      const invalidPrice = { amount: -1, currency: 'USD' };

      // First call with invalid input
      const command1 = new CreateProductRequestDto({
        name: invalidName,
        price: invalidPrice,
      });
      const validationResult1 = validator.validate(command1);
      expect(validationResult1.isValid).toBe(false);
      expect(validationResult1.exceptions.length).toBeGreaterThan(0);

      // Second call with valid input
      const command2 = new CreateProductRequestDto({
        name: validName,
        price: validPrice,
      });
      const validationResult2 = validator.validate(command2);
      expect(validationResult2.isValid).toBe(true);
      expect(validationResult2.exceptions.length).toBe(0);
    });
  });
});
