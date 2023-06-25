import { ProductDomainExceptions } from '@domain-exceptions/product';
import { UpdateProductRequestValidator } from '@use-cases/update-product/application-services';
import { UpdateProductRequestDto } from '@use-cases/update-product/dtos';
import {
  ArgumentTooLongException,
  StringExceptionCodes,
  ValidationResponse,
} from 'common-base-classes';

describe('UpdateProductValidator', () => {
  let updateProductValidator: UpdateProductRequestValidator;

  beforeEach(() => {
    updateProductValidator = new UpdateProductRequestValidator();
  });

  it('should have an empty array of exceptions when initialized', () => {
    expect(updateProductValidator.exceptions).toEqual(new Map());
  });

  describe('validate', () => {
    it('should not add any exceptions if the command is valid', () => {
      const updateProductCommand: UpdateProductRequestDto = {
        id: '123',
        name: 'Test Product Name',
        price: {
          amount: 10.99,
          currency: 'USD',
        },
        description: 'Test Product Description',
        image: 'https://example.com/image.png',
      };
      const response: ValidationResponse =
        updateProductValidator.validate(updateProductCommand);
      expect(response.isValid).toBe(true);
      expect(updateProductValidator.exceptions).toEqual(new Map());
    });

    it('should add an exception if the name is not valid', () => {
      const updateProductCommand = new UpdateProductRequestDto({
        id: '123',
        name: '',
        price: {
          amount: 10.99,
          currency: 'USD',
        },
        description: '',
        image: 'not valid',
      });
      const response: ValidationResponse =
        updateProductValidator.validate(updateProductCommand);
      expect(response.isValid).toBe(false);
      expect(response.exceptions).toEqual(
        expect.arrayContaining([
          new ProductDomainExceptions.NameDoesNotValid(),
        ]),
      );
    });

    it('should add an exception if the price is not valid', () => {
      const updateProductCommand: UpdateProductRequestDto = {
        id: '123',
        name: 'Test Product Name',
        price: {
          amount: -10.99,
          currency: 'USD',
        },
      };
      const response: ValidationResponse =
        updateProductValidator.validate(updateProductCommand);
      expect(response.isValid).toBe(false);
      expect(Array.from(updateProductValidator.exceptions.values())).toEqual(
        expect.arrayContaining([
          new ProductDomainExceptions.PriceDoesNotValid(),
        ]),
      );
    });

    it('should add an exception if null is provided', () => {
      const updateProductCommand: UpdateProductRequestDto = {
        id: '123',
        name: null,
        price: null,
      };
      const response: ValidationResponse =
        updateProductValidator.validate(updateProductCommand);
      expect(response.isValid).toBe(false);
      expect(Array.from(updateProductValidator.exceptions.values())).toEqual(
        expect.arrayContaining([
          new ProductDomainExceptions.PriceDoesNotValid(),
          new ProductDomainExceptions.NameDoesNotValid(),
        ]),
      );
    });

    it('should ignore the undefined since it mean not provided', () => {
      const updateProductCommand: UpdateProductRequestDto = {
        id: '123',
        name: undefined,
        price: {
          amount: 11.99,
          currency: 'USD',
        },
      };
      const response: ValidationResponse =
        updateProductValidator.validate(updateProductCommand);
      expect(response.isValid).toBe(true);
      expect(updateProductValidator.exceptions).toEqual(new Map());
    });
  });

  describe('clearExceptions', () => {
    it('should clear the exceptions array', () => {
      updateProductValidator.exceptions.set(
        StringExceptionCodes.tooLong,
        new ArgumentTooLongException(),
      );
      (updateProductValidator as any).clearExceptions();
      expect(updateProductValidator.exceptions).toEqual(new Map());
    });
  });

  describe('validateName', () => {
    it('should not add any exceptions if the name is valid', () => {
      (updateProductValidator as any).validateName('Test Product Name');
      expect(updateProductValidator.exceptions).toEqual(new Map());
    });

    it('should add an exception if the name is not valid', () => {
      (updateProductValidator as any).validateName('');
      expect(Array.from(updateProductValidator.exceptions.values())).toEqual(
        expect.arrayContaining([
          new ProductDomainExceptions.NameDoesNotValid(),
        ]),
      );
    });
  });
});
