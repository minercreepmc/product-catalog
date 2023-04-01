import { CreateProductCommandValidator } from '@product-use-case/create-product/application-services';
import { CreateProductCommand } from '@product-use-case/create-product/dtos';

describe('CreateProductCommandValidator', () => {
  let validator: CreateProductCommandValidator;

  beforeEach(() => {
    validator = new CreateProductCommandValidator();
  });

  describe('validate', () => {
    it('should return a success validation response when the command is valid', () => {
      const command = new CreateProductCommand({
        name: 'Valid Name',
        price: {
          amount: 100,
          currency: 'USD',
        },
      });
      const validationResult = validator.validate(command);
      expect(validationResult.isValid).toBe(true);
    });

    it('should return a failed validation response when the command is invalid', () => {
      const command = new CreateProductCommand({
        name: '',
        price: {
          amount: -1,
          currency: 'USD',
        },
      });
      const validationResult = validator.validate(command);
      expect(validationResult.isValid).toBe(false);
    });

    it('should call validateName and validatePrice methods with the correct parameters', () => {
      const command = new CreateProductCommand({
        name: 'Valid Name',
        price: {
          amount: 100,
          currency: 'USD',
        },
      });

      const validateNameSpy = jest.spyOn(validator, 'validateName' as any);
      const validatePriceSpy = jest.spyOn(validator, 'validatePrice' as any);

      validator.validate(command);

      expect(validateNameSpy).toHaveBeenCalledWith(command.name);
      expect(validatePriceSpy).toHaveBeenCalledWith(command.price);
    });

    it('should clear exceptions after multiple calls to validate', () => {
      const validName = 'Valid Name';
      const invalidName = '';
      const validPrice = { amount: 100, currency: 'USD' };
      const invalidPrice = { amount: -1, currency: 'USD' };

      // First call with invalid input
      const command1 = new CreateProductCommand({
        name: invalidName,
        price: invalidPrice,
      });
      const validationResult1 = validator.validate(command1);
      expect(validationResult1.isValid).toBe(false);
      expect(validationResult1.exceptions.length).toBeGreaterThan(0);

      // Second call with valid input
      const command2 = new CreateProductCommand({
        name: validName,
        price: validPrice,
      });
      const validationResult2 = validator.validate(command2);
      expect(validationResult2.isValid).toBe(true);
      expect(validationResult2.exceptions.length).toBe(0);
    });
  });
});
