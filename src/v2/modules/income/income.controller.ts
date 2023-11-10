import { ApiApplication } from '@constants';
import { JwtGuard } from '@guards/jwt';
import { RoleGuard } from '@guards/roles';
import { Controller, Post, UseGuards } from '@nestjs/common';
import { USERS_ROLE } from '@v2/users/constants';
import { IncomeService } from './income.service';

@Controller(ApiApplication.INCOME.CONTROLLER)
@UseGuards(JwtGuard, RoleGuard(USERS_ROLE.ADMIN))
export class IncomeController {
  constructor(private incomeService: IncomeService) {}
  @Post(ApiApplication.INCOME.GET_DAILY)
  async getIncomeDaily() {
    return this.incomeService.getIncomeDaily();
  }

  @Post(ApiApplication.INCOME.GET_MONTHLY)
  async getIncomeMonthly() {
    return this.incomeService.getIncomeMonthly();
  }

  @Post(ApiApplication.INCOME.GET_WEEKLY)
  async getIncomeWeekly() {
    return this.incomeService.getIncomeWeekly();
  }

  @Post(ApiApplication.INCOME.GET_YEARLY)
  async getIncomeYearly() {
    return this.incomeService.getIncomeYearly();
  }
}
