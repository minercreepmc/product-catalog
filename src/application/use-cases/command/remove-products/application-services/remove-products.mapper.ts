import { CommandMapperBase } from '@base/use-cases';
import { RemoveProductsCommand } from '@commands/remove-products.command';
import { ProductRemovedDomainEvent } from '@domain-events/product';
import { Injectable } from '@nestjs/common';
import { ProductIdValueObject } from '@value-objects/product';
import { RemoveProductsRequestDto, RemoveProductsResponseDto } from '../dtos';

@Injectable()
export class RemoveProductsMapper extends CommandMapperBase<RemoveProductsResponseDto> {
  toCommand(dto: RemoveProductsRequestDto) {
    return new RemoveProductsCommand({
      ids: dto.ids.map((id) => new ProductIdValueObject(id)),
    });
  }
  toResponseDto(
    events: ProductRemovedDomainEvent[],
  ): RemoveProductsResponseDto {
    const response: RemoveProductsResponseDto = {
      ids: events.map((event) => event.productId.unpack()),
    };
    return new RemoveProductsResponseDto(response);
  }
}
