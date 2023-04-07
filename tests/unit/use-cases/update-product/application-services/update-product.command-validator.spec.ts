import { ProductDomainExceptions } from '@domain-exceptions/product';
import { UpdateProductCommandValidator } from '@use-cases/update-product/application-services';
import { UpdateProductCommand } from '@use-cases/update-product/dtos';
import {
  ArgumentTooLongException,
  StringExceptionCodes,
  ValidationResponse,
} from 'common-base-classes';

describe('UpdateProductCommandValidator', () => {
  let updateProductCommandValidator: UpdateProductCommandValidator;

  beforeEach(() => {
    updateProductCommandValidator = new UpdateProductCommandValidator();
  });

  it('should have an empty array of exceptions when initialized', () => {
    expect(updateProductCommandValidator.exceptions).toEqual(new Map());
  });

  describe('validate', () => {
    it('should not add any exceptions if the command is valid', () => {
      const updateProductCommand: UpdateProductCommand = {
        productId: '123',
        name: 'Test Product Name',
        price: {
          amount: 10.99,
          currency: 'USD',
        },
        description: 'Test Product Description',
        image: 'https://example.com/image.png',
      };
      const response: ValidationResponse =
        updateProductCommandValidator.validate(updateProductCommand);
      expect(response.isValid).toBe(true);
      expect(updateProductCommandValidator.exceptions).toEqual(new Map());
    });

    it('should add an exception if the name is not valid', () => {
      const updateProductCommand = new UpdateProductCommand({
        productId: '123',
        name: '',
        price: {
          amount: 10.99,
          currency: 'USD',
        },
        description: '',
        image: 'not valid',
      });
      const response: ValidationResponse =
        updateProductCommandValidator.validate(updateProductCommand);
      expect(response.isValid).toBe(false);
      expect(response.exceptions).toEqual(
        expect.arrayContaining([new ProductDomainExceptions.NameDoesNotValid()]),
      );
    });

    it('should add an exception if the price is not valid', () => {
      const updateProductCommand: UpdateProductCommand = {
        productId: '123',
        name: 'Test Product Name',
        price: {
          amount: -10.99,
          currency: 'USD',
        },
      };
      const response: ValidationResponse =
        updateProductCommandValidator.validate(updateProductCommand);
      expect(response.isValid).toBe(false);
      expect(
        Array.from(updateProductCommandValidator.exceptions.values()),
      ).toEqual(
        expect.arrayContaining([new ProductDomainExceptions.PriceDoesNotValid()]),
      );
    });

    it('should add an exception if null is provided', () => {
      const updateProductCommand: UpdateProductCommand = {
        productId: '123',
        name: null,
        price: null,
      };
      const response: ValidationResponse =
        updateProductCommandValidator.validate(updateProductCommand);
      expect(response.isValid).toBe(false);
      expect(
        Array.from(updateProductCommandValidator.exceptions.values()),
      ).toEqual(
        expect.arrayContaining([
          new ProductDomainExceptions.PriceDoesNotValid(),
          new ProductDomainExceptions.NameDoesNotValid(),
        ]),
      );
    });

    it('should ignore the undefined since it mean not provided', () => {
      const updateProductCommand: UpdateProductCommand = {
        productId: '123',
        name: undefined,
        price: {
          amount: 11.99,
          currency: 'USD',
        },
      };
      const response: ValidationResponse =
        updateProductCommandValidator.validate(updateProductCommand);
      expect(response.isValid).toBe(true);
      expect(updateProductCommandValidator.exceptions).toEqual(new Map());
    });
  });

  describe('clearExceptions', () => {
    it('should clear the exceptions array', () => {
      updateProductCommandValidator.exceptions.set(
        StringExceptionCodes.tooLong,
        new ArgumentTooLongException(),
      );
      (updateProductCommandValidator as any).clearExceptions();
      expect(updateProductCommandValidator.exceptions).toEqual(new Map());
    });
  });

  describe('validateName', () => {
    it('should not add any exceptions if the name is valid', () => {
      (updateProductCommandValidator as any).validateName('Test Product Name');
      expect(updateProductCommandValidator.exceptions).toEqual(new Map());
    });

    it('should add an exception if the name is not valid', () => {
      (updateProductCommandValidator as any).validateName('');
      expect(
        Array.from(updateProductCommandValidator.exceptions.values()),
      ).toEqual(
        expect.arrayContaining([new ProductDomainExceptions.NameDoesNotValid()]),
      );
    });
  });
});
