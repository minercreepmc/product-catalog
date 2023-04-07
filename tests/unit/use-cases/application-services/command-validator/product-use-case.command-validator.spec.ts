import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ProductCommandValidator } from '@use-cases/application-services/command-validators';

describe('ProductCommandValidator', () => {
  let validator: ProductCommandValidator;

  beforeEach(() => {
    validator = new ProductCommandValidator();
  });

  it('should return an empty validation response when the command is valid', () => {
    const command = {
      id: '123',
      name: 'Product Name',
      price: { amount: 10, currency: 'USD' },
      description: 'Product Description',
      image: 'https://example.com/image.png',
    };
    const result = validator.validate(command);
    expect(result.isValid).toBe(true);
    expect(result.exceptions.length).toBe(0);
  });

  it('should partially validate the command when the command is invalid', () => {
    const command = {
      id: '123',
      price: { amount: 10, currency: 'USD' },
      image: 'https://example.com/image.png',
    };
    const result = validator.validate(command);
    expect(result.isValid).toBe(true);
    expect(result.exceptions.length).toBe(0);
  });

  it('should return validation exceptions when the command is invalid', () => {
    const command = {
      id: '',
      name: '',
      price: { amount: 0, currency: 'USD' },
      description: '',
      image: 'invalid-url',
    };
    const result = validator.validate(command);
    expect(result.isValid).toBe(false);
    expect(result.exceptions).toIncludeAllMembers([
      new ProductDomainExceptions.IdDoesNotValid(),
      new ProductDomainExceptions.NameDoesNotValid(),
      new ProductDomainExceptions.PriceDoesNotValid(),
      new ProductDomainExceptions.DescriptionDoesNotValid(),
      new ProductDomainExceptions.ImageDoesNotValid(),
    ]);
  });
});
