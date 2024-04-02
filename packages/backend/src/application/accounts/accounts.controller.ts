import { Controller, Get } from '@nestjs/common';
import { AccountsService } from './accounts.service';

@Controller('accounts')
export class AccountsController {
  constructor(private readonly AccountsService: AccountsService) {}

  @Get()
  async getAllAccounts() {
    return this.AccountsService.getAllAccounts()
  }

}