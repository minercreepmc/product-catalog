import { V1UserHttpController } from '@controllers/http/v1';
import { UserRepository } from '@database/repositories/pg/user';
import { Module } from '@nestjs/common';

@Module({
  controllers: [V1UserHttpController],
  providers: [UserRepository],
})
export class UserModule {}
