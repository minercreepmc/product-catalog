import { ApiApplication } from '@constants';
import { JwtGuard } from '@guards/jwt';
import { RoleGuard } from '@guards/roles';
import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserRole } from '@v2/users/constants';
import { IncomeService } from './income.service';

@Controller(ApiApplication.INCOME.CONTROLLER)
@UseGuards(JwtGuard, RoleGuard(UserRole.ADMIN))
export class IncomeController {
  constructor(private incomeService: IncomeService) {}
  @Get(ApiApplication.INCOME.GET_DAILY)
  async getIncomeDaily() {
    return this.incomeService.getIncomeDaily();
  }

  @Get(ApiApplication.INCOME.GET_MONTHLY)
  async getIncomeMonthly() {
    return this.incomeService.getIncomeMonthly();
  }

  @Get(ApiApplication.INCOME.GET_WEEKLY)
  async getIncomeWeekly() {
    return this.incomeService.getIncomeWeekly();
  }

  @Get(ApiApplication.INCOME.GET_YEARLY)
  async getIncomeYearly() {
    return this.incomeService.getIncomeYearly();
  }
}
