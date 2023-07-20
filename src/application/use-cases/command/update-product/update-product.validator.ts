import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ProductManagementDomainService } from '@domain-services';
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
export class UpdateProductValidator
  implements ValidatorBase<UpdateProductCommand, UpdateProductFailure>
{
  async validate(
    command: UpdateProductCommand,
  ): Promise<Notification<UpdateProductFailure>> {
    this.command = command;

    const note = new Notification<UpdateProductFailure>();

    await this.nameMustBeUnique(note);

    return note;
  }

  private async nameMustBeUnique(note: Notification<UpdateProductFailure>) {
    const isExist = await this.productManagementService.doesProductExistByName(
      this.command.name,
    );

    if (isExist) {
      note.addException(new ProductDomainExceptions.AlreadyExist());
    }
  }

  private command: UpdateProductCommand;
  constructor(
    private readonly productManagementService: ProductManagementDomainService,
  ) {}
}
