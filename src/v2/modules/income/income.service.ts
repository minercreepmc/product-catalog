import { Injectable } from '@nestjs/common';
import { IncomeRepository } from './income.repository';

@Injectable()
export class IncomeService {
  constructor(private incomeRepo: IncomeRepository) {}
  async getIncomeDaily() {
    return this.incomeRepo.getIncomeDaily();
  }

  async getIncomeMonthly() {
    return this.incomeRepo.getIncomeMonthly();
  }

  async getIncomeWeekly() {
    return this.incomeRepo.getIncomeWeekly();
  }

  async getIncomeYearly() {
    return this.incomeRepo.getIncomeYearly();
  }
}
