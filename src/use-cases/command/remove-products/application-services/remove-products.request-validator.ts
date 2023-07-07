import { Injectable } from '@nestjs/common';
import { ProductRequestValidator } from '@use-cases/shared/application-services/validators';
import { RemoveProductsRequestDto } from '../dtos';

@Injectable()
export class RemoveProductsRequestValidator extends ProductRequestValidator {
  _validate(requestDto: RemoveProductsRequestDto): void {
    const { ids } = requestDto;

    ids.forEach((id) => {
      this.validateProductId(id);
    });
  }
}
