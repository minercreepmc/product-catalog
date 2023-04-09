import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import { CreateProductHandler } from '@use-cases/create-product';
import {
  CreateProductCommand,
  CreateProductResponseDto,
} from '@use-cases/create-product/dtos';
import { faker } from '@faker-js/faker';
import { MoneyCurrencyEnum } from '@value-objects/common/money';
import {
  UseCaseProcessExceptions,
  UseCaseCommandValidationExceptions,
} from '@use-cases/common';

/* eslint-disable@typescript-eslint/no-unused-vars */
describe('CreateProductHandler (integration test)', () => {
  let handler: CreateProductHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    handler = module.get<CreateProductHandler>(CreateProductHandler);
  });

  // Test scenarios go here
  test('should return UseCaseCommandValidationExceptions when the command is invalid', async () => {
    // Arrange
    const command = new CreateProductCommand({
      name: '',
      price: {
        amount: faker.datatype.number(),
        currency: '',
      },
    });

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toBeInstanceOf(
      UseCaseCommandValidationExceptions,
    );
  });

  test('should return UseCaseBusinessValidationExceptions when the process fails', async () => {
    // Arrange
    const command = new CreateProductCommand({
      name: faker.commerce.productName(),
      price: {
        amount: faker.datatype.number(),
        currency: MoneyCurrencyEnum.USD,
      },
    });

    // Act
    await handler.execute(command);
    const result = await handler.execute(command);

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toBeInstanceOf(UseCaseProcessExceptions);
  });

  test('should return a valid CreateProductResult when the command is valid', async () => {
    // Arrange
    const command = new CreateProductCommand({
      name: faker.commerce.productName(),
      price: {
        amount: faker.datatype.number(),
        currency: MoneyCurrencyEnum.USD,
      },
    });

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(result.isOk()).toBeTruthy();
    expect(result.unwrap()).toBeInstanceOf(CreateProductResponseDto);
  });
});
