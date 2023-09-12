import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ProductVerificationDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { Result } from 'oxide.ts';
import {
  CreateProductCommand,
  CreateProductResponseDto,
} from './create-product.dto';

export type CreateProductSuccess = CreateProductResponseDto;
export type CreateProductFailure = Array<ProductDomainExceptions.AlreadyExist>;
export type CreateProductResult = Result<
  CreateProductSuccess,
  CreateProductFailure
>;

@Injectable()
export class CreateProductValidator extends ValidatorBase<
  CreateProductCommand,
  CreateProductFailure
> {
  async validate(command: CreateProductCommand) {
    this.command = command;

    const note = new Notification<CreateProductFailure>();
    await this.nameMustBeUnique(note);
    return note;
  }

  private async nameMustBeUnique(
    note: Notification<CreateProductFailure>,
  ): Promise<void> {
    const isExist = await this.productVerificationService.doesProductNameExist(
      this.command.name,
    );

    if (isExist) {
      note.addException(new ProductDomainExceptions.AlreadyExist());
    }
  }

  command: CreateProductCommand;
  constructor(
    private readonly productVerificationService: ProductVerificationDomainService,
  ) {
    super();
  }
}
