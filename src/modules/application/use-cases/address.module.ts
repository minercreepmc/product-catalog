import { V1AddressHttpController } from '@controllers/http/v1/address.http.controller.v1';
import { AddressRepository } from '@database/repositories/pg/address';
import { Module } from '@nestjs/common';
import { AddressService } from '@use-cases/command/address';
import { RulesModule } from '@modules/application';

@Module({
  imports: [RulesModule],
  controllers: [V1AddressHttpController],
  providers: [AddressService, AddressRepository],
})
export class AddressModule {}
