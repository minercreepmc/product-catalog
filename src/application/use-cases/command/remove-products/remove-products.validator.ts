import { ValidatorBase } from '@base/use-cases';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import {
  ProductManagementDomainService,
  ProductVerificationDomainService,
} from '@domain-services';
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
export class RemoveProductsValidator extends ValidatorBase<
  RemoveProductsCommand,
  RemoveProductsFailure
> {
  async validate(command: RemoveProductsCommand) {
    this.command = command;
    const note = new Notification<RemoveProductsFailure>();

    await this.productsMustExist(note);

    return note;
  }

  async productsMustExist(note: Notification<RemoveProductsFailure>) {
    const exist = await this.productVerificationService.doesProductIdsExist(
      this.command.ids,
    );

    if (!exist) {
      note.addException(new ProductDomainExceptions.DoesNotExist());
    }
  }

  command: RemoveProductsCommand;
  constructor(
    private readonly productVerificationService: ProductVerificationDomainService,
  ) {
    super();
  }
}
