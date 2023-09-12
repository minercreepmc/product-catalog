import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ProductVerificationDomainService } from '@domain-services';
import { Injectable } from '@nestjs/common';
import { Result } from 'oxide.ts';
import {
  UpdateProductCommand,
  UpdateProductResponseDto,
} from './update-product.dto';

export type UpdateProductSuccess = UpdateProductResponseDto;
export type UpdateProductFailure = Array<ProductDomainExceptions.DoesNotExist>;

export type UpdateProductResult = Result<
  UpdateProductSuccess,
  UpdateProductFailure
>;

@Injectable()
export class UpdateProductValidator extends ValidatorBase<
  UpdateProductCommand,
  UpdateProductFailure
> {
  async validate(
    command: UpdateProductCommand,
  ): Promise<Notification<UpdateProductFailure>> {
    this.command = command;

    const note = new Notification<UpdateProductFailure>();

    await this.productIdMustExist(note);

    return note;
  }

  private async productIdMustExist(note: Notification<UpdateProductFailure>) {
    const isExist = await this.productVerificationService.doesProductIdExist(
      this.command.id,
    );

    if (!isExist) {
      note.addException(new ProductDomainExceptions.DoesNotExist());
    }
  }

  command: UpdateProductCommand;
  constructor(
    private readonly productVerificationService: ProductVerificationDomainService,
  ) {
    super();
  }
}
