import { CreateShippingStatusDto, UpdateShippingStatusDto } from '@api/http';
import { Body, Controller, Param, Query } from '@nestjs/common';
import { ShippingStatusService } from '@use-cases/command/shipping';

@Controller('/api/v1/shipping/status')
export class V1ShippingStatusHttpController {
  constructor(private readonly shippingStatusService: ShippingStatusService) {}
  create(@Body() dto: CreateShippingStatusDto) {
    return this.shippingStatusService.create(dto);
  }

  update(@Param('id') id: string, @Body() dto: UpdateShippingStatusDto) {
    return this.shippingStatusService.update(id, dto);
  }

  delete(@Param('id') id: string) {
    return this.shippingStatusService.delete(id);
  }

  findAllByShippingId(@Query('shippingId') shippingId: string) {
    return this.shippingStatusService.findAllByShippingId(shippingId);
  }
}
