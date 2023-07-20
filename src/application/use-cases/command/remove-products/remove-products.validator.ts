import { ValidatorBase } from '@base/use-cases';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { ProductManagementDomainService } from '@domain-services';
import { Result } from 'oxide.ts';
import {
  RemoveProductsCommand,
  RemoveProductsResponseDto,
} from './remove-products.dto';
import { Notification } from '@base/patterns';
import { Injectable } from '@nestjs/common';

export type RemoveProductsSuccess = RemoveProductsResponseDto;
export type RemoveProductsFailure = Array<ProductDomainExceptions.DoesNotExist>;
export type RemoveProductsResult = Result<
  RemoveProductsSuccess,
  RemoveProductsFailure
>;

@Injectable()
export class RemoveProductsValidator
  implements ValidatorBase<RemoveProductsCommand, RemoveProductsFailure>
{
  async validate(command: RemoveProductsCommand) {
    this.command = command;
    const note = new Notification<RemoveProductsFailure>();

    await this.productsMustExist(note);

    return note;
  }

  async productsMustExist(note: Notification<RemoveProductsFailure>) {
    const exist = this.productManagementService.doesProductIdsExist(
      this.command.ids,
    );

    if (!exist) {
      note.addException(new ProductDomainExceptions.DoesNotExist());
    }
  }

  private command: RemoveProductsCommand;
  constructor(
    private readonly productManagementService: ProductManagementDomainService,
  ) {}
}
