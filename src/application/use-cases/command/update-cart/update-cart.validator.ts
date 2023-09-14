import { Notification } from '@base/patterns';
import { ValidatorBase } from '@base/use-cases';
import { CartDomainExceptions } from '@domain-exceptions/cart';
import { ProductDomainExceptions } from '@domain-exceptions/product';
import { UserDomainExceptions } from '@domain-exceptions/user';
import {
  ProductVerificationDomainService,
  UserVerificationDomainService,
} from '@domain-services';
import { CartVerificationDomainService } from '@domain-services/cart-verification.domain-service';
import { Injectable } from '@nestjs/common';
import { UpdateCartCommand } from './update-cart.dto';
import { UpdateCartFailure } from './update-cart.result';

@Injectable()
export class UpdateCartValidator extends ValidatorBase<
  UpdateCartCommand,
  UpdateCartFailure
> {
  constructor(
    private readonly productVerificationService: ProductVerificationDomainService,
    private readonly cartVerificationService: CartVerificationDomainService,
    private readonly userVerificationService: UserVerificationDomainService,
  ) {
    super();
  }
  command: UpdateCartCommand;
  async validate(
    command: UpdateCartCommand,
  ): Promise<Notification<UpdateCartFailure>> {
    this.command = command;
    const note = new Notification<UpdateCartFailure>();

    await this.userMustExist(note);
    await this.productMustExist(note);
    await this.cartItemMustNotBeTheSame(note);
    await this.cartMustExist(note);

    return note;
  }

  private async cartMustExist(note: Notification<UpdateCartFailure>) {
    for (const item of this.command.items) {
      const cart = await this.cartVerificationService.doesCartIdExist(
        item.cartId,
      );

      if (!cart) {
        note.addException(new CartDomainExceptions.DoesNotExist());
        break;
      }
    }
  }

  private async userMustExist(note: Notification<UpdateCartFailure>) {
    const user = await this.userVerificationService.doesUserIdExist(
      this.command.userId,
    );

    if (!user) {
      note.addException(new UserDomainExceptions.CredentialDoesNotValid());
    }
  }

  private async productMustExist(note: Notification<UpdateCartFailure>) {
    for (const item of this.command.items) {
      const exist = await this.productVerificationService.doesProductIdExist(
        item.productId,
      );

      if (!exist) {
        note.addException(new ProductDomainExceptions.DoesNotExist());
        break;
      }
    }
  }

  private async cartItemMustNotBeTheSame(
    note: Notification<UpdateCartFailure>,
  ) {
    const itHave = await this.cartVerificationService.doesCartItemsDuplicate(
      this.command.items.map((item) => item.productId),
    );
    if (itHave) {
      note.addException(new CartDomainExceptions.ItemMustBeUnique());
    }
  }
}
