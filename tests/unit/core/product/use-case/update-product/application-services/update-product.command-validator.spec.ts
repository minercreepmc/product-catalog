import { ProductDomainException } from '@product-domain/domain-exceptions';
import { UpdateProductCommandValidator } from '@product-use-case/update-product/application-services';
import { UpdateProductCommand } from '@product-use-case/update-product/dtos';
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
      });
      const response: ValidationResponse =
        updateProductCommandValidator.validate(updateProductCommand);
      expect(response.isValid).toBe(false);
      expect(response.exceptions).toEqual(
        expect.arrayContaining([new ProductDomainException.NameIsNotValid()]),
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
        expect.arrayContaining([new ProductDomainException.PriceIsNotValid()]),
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
          new ProductDomainException.PriceIsNotValid(),
          new ProductDomainException.NameIsNotValid(),
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
        expect.arrayContaining([new ProductDomainException.NameIsNotValid()]),
      );
    });
  });
});
