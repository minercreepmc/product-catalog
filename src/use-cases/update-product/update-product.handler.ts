import { CommandHandler } from '@nestjs/cqrs';
import {
  UseCaseCommandValidationExceptions,
  UseCaseProcessExceptions,
} from '@use-cases/common';
import { Err, Ok } from 'oxide.ts';
import {
  UpdateProductProcess,
  UpdateProductValidator,
} from './application-services';
import { UpdateProductMapper } from './application-services/update-product.mapper';
import { UpdateProductCommand, UpdateProductResult } from './dtos';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler {
  constructor(
    private readonly validator: UpdateProductValidator,
    private readonly updateProductProcess: UpdateProductProcess,
    private readonly mapper: UpdateProductMapper,
  ) {}
  async execute(command: UpdateProductCommand): Promise<UpdateProductResult> {
    const commandValidated = this.validator.validate(command);
    if (!commandValidated.isValid) {
      return Err(
        new UseCaseCommandValidationExceptions(commandValidated.exceptions),
      );
    }
    const domainOptions = this.mapper.toDomain(command);

    const updateProductResult = await this.updateProductProcess.execute(
      domainOptions,
    );
    if (updateProductResult.isErr()) {
      return Err(new UseCaseProcessExceptions(updateProductResult.unwrapErr()));
    }

    return Ok(this.mapper.toResponseDto(updateProductResult.unwrap()));
  }
}
