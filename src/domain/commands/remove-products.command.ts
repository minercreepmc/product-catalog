import { ProductIdValueObject } from '@value-objects/product';

export class RemoveProductsCommand {
  readonly ids: ProductIdValueObject[];
  constructor(options: RemoveProductsCommand) {
    this.ids = options.ids;
  }
}
