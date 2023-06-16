import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '@src/app.module';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import { CreateReviewerHandler } from '@use-cases/create-reviewer';
import {
  CreateReviewerRequestDto,
  CreateReviewerResponseDto,
} from '@use-cases/create-reviewer/dtos';
import { faker } from '@faker-js/faker';
import { reviewerRoles } from '@value-objects/reviewer';

describe('CreateReviewerHandler (integration test)', () => {
  let handler: CreateReviewerHandler;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    handler = module.get<CreateReviewerHandler>(CreateReviewerHandler);
  });

  // Test scenarios go here
  test('should return UseCaseCommandValidationExceptions when the command is invalid', async () => {
    // Arrange
    const command = new CreateReviewerRequestDto({
      name: '',
      email: '',
      role: '',
    });

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toBeInstanceOf(
      UseCaseCommandValidationExceptions,
    );
  });

  test('should return UseCaseProcessExceptions when the process fails', async () => {
    // Arrange
    const command = new CreateReviewerRequestDto({
      name: faker.name.fullName(),
      email: faker.internet.email().toLowerCase(),
      role: faker.helpers.arrayElement(reviewerRoles),
    });

    // Act
    await handler.execute(command);
    const result = await handler.execute(command);

    // Assert
    expect(result.isErr()).toBeTruthy();
    expect(result.unwrapErr()).toBeInstanceOf(UseCaseProcessExceptions);
  });

  test('should return a valid CreateReviewerResult when the command is valid', async () => {
    // Arrange
    const command = new CreateReviewerRequestDto({
      name: faker.name.fullName(),
      email: faker.internet.email().toLowerCase(),
      role: faker.helpers.arrayElement(reviewerRoles),
    });

    // Act
    const result = await handler.execute(command);

    // Assert
    expect(result.isOk()).toBeTruthy();
    expect(result.unwrap()).toBeInstanceOf(CreateReviewerResponseDto);
  });
});
