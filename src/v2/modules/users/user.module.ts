import { Module } from '@nestjs/common';
import { ShippingRepository } from '@v2/shipping';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserRepository, UserService, ShippingRepository],
})
export class UserModule {}
