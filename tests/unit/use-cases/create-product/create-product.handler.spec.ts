import { CreateProductHandler } from '@use-cases/create-product';
import {
  CreateProductMapper,
  CreateProductProcess,
  CreateProductValidator,
} from '@use-cases/create-product/application-services';
import { CreateProductCommand } from '@use-cases/create-product/dtos';
import { mock, MockProxy } from 'jest-mock-extended';
import { faker } from '@faker-js/faker';
import { MoneyCurrencyEnum } from '@value-objects/common/money';
import { ValidationResponse } from 'common-base-classes';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { Err, Ok } from 'oxide.ts';
import { ProductCreatedDomainEvent } from '@domain-events/product';
import {
  ProductIdValueObject,
  ProductNameValueObject,
  ProductPriceValueObject,
} from '@value-objects/product';

describe('CreateProductHandler', () => {
  let handler: CreateProductHandler;
  let validator: MockProxy<CreateProductValidator>;
  let createProductProcess: MockProxy<CreateProductProcess>;
  let mapper: MockProxy<CreateProductMapper>;

  beforeEach(() => {
    validator = mock<CreateProductValidator>();
    createProductProcess = mock<CreateProductProcess>();
    mapper = mock<CreateProductMapper>();

    handler = new CreateProductHandler(validator, createProductProcess, mapper);
  });

  describe('execute', () => {
    const command = new CreateProductCommand({
      name: faker.commerce.productName(),
      price: {
        amount: Number(faker.commerce.price()),
        currency: MoneyCurrencyEnum.USD,
      },
    });

    it('should return UseCaseCommandValidationExceptions when command validation fails', async () => {
      // Arrange
      validator.validate.mockReturnValue(
        ValidationResponse.fail([new ProductDomainExceptions.IdDoesNotValid()]),
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isErr()).toBeTruthy();
      // Add more assertions for UseCaseCommandValidationExceptions
    });

    it('should return UseCaseBusinessValidationExceptions when business validation fails', async () => {
      // Arrange
      validator.validate.mockReturnValue(ValidationResponse.success());
      createProductProcess.execute.mockResolvedValue(
        Err([new ProductDomainExceptions.DoesExist()]),
      );

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isErr()).toBeTruthy();
      // Add more assertions for UseCaseBusinessValidationExceptions
    });

    it('should return a successful result when command and business validations pass', async () => {
      // Arrange
      validator.validate.mockReturnValue(ValidationResponse.success());

      const okResult = Ok(
        new ProductCreatedDomainEvent({
          productId: new ProductIdValueObject(faker.datatype.uuid()),
          details: {
            name: new ProductNameValueObject(faker.commerce.productName()),
            price: ProductPriceValueObject.create({
              amount: Number(faker.commerce.price()),
              currency: MoneyCurrencyEnum.USD,
            }),
          },
        }),
      );
      createProductProcess.execute.mockResolvedValue(okResult);

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result.isOk()).toBeTruthy();
      // Add more assertions for the successful result
    });
  });
});
