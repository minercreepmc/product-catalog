import { Module } from '@nestjs/common';
import { IncomeController } from './income.controller';
import { IncomeRepository } from './income.repository';
import { IncomeService } from './income.service';

@Module({
  imports: [],
  controllers: [IncomeController],
  providers: [IncomeRepository, IncomeService],
})
export class IncomeModule {}
