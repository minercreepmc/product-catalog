import { UpdateProductCommandValidator } from '@product-use-case/update-product/application-services';
import { UpdateProductCommand } from '@product-use-case/update-product/dtos';
import {
  ArgumentContainsEmptyStringException,
  ArgumentContainsNegativeException,
  ValidationException,
  ValidationResponse,
} from 'common-base-classes';

describe('UpdateProductCommandValidator', () => {
  let updateProductCommandValidator: UpdateProductCommandValidator;

  beforeEach(() => {
    updateProductCommandValidator = new UpdateProductCommandValidator();
  });

  it('should have an empty array of exceptions when initialized', () => {
    expect(updateProductCommandValidator.exceptions).toEqual([]);
  });

  describe('validate', () => {
    it('should not add any exceptions if the command is valid', () => {
      const updateProductCommand: UpdateProductCommand = {
        id: '12345',
        name: 'Test Product Name',
        price: {
          amount: 10.99,
          currency: 'USD',
        },
      };
      const response: ValidationResponse =
        updateProductCommandValidator.validate(updateProductCommand);
      expect(response.isValid).toBe(true);
      expect(updateProductCommandValidator.exceptions).toEqual([]);
    });

    it('should add an exception if the name is not valid', () => {
      const updateProductCommand = new UpdateProductCommand({
        id: '12345',
        name: '',
        price: {
          amount: 10.99,
          currency: 'USD',
        },
      });
      const response: ValidationResponse =
        updateProductCommandValidator.validate(updateProductCommand);
      expect(response.isValid).toBe(false);
      expect(response.exceptions).toEqual(
        expect.arrayContaining([new ArgumentContainsEmptyStringException()]),
      );
    });

    it('should add an exception if the price is not valid', () => {
      const updateProductCommand: UpdateProductCommand = {
        id: '12345',
        name: 'Test Product Name',
        price: {
          amount: -10.99,
          currency: 'USD',
        },
      };
      const response: ValidationResponse =
        updateProductCommandValidator.validate(updateProductCommand);
      expect(response.isValid).toBe(false);
      expect(updateProductCommandValidator.exceptions).toEqual(
        expect.arrayContaining([new ArgumentContainsNegativeException()]),
      );
    });
  });

  describe('clearExceptions', () => {
    it('should clear the exceptions array', () => {
      updateProductCommandValidator.exceptions = [
        new ValidationException('Test Exception'),
      ];
      (updateProductCommandValidator as any).clearExceptions();
      expect(updateProductCommandValidator.exceptions).toEqual([]);
    });
  });

  describe('validateName', () => {
    it('should not add any exceptions if the name is valid', () => {
      (updateProductCommandValidator as any).validateName('Test Product Name');
      expect(updateProductCommandValidator.exceptions).toEqual([]);
    });

    it('should add an exception if the name is not valid', () => {
      (updateProductCommandValidator as any).validateName('');
      expect(updateProductCommandValidator.exceptions).toEqual(
        expect.arrayContaining([new ArgumentContainsEmptyStringException()]),
      );
    });
  });
});
