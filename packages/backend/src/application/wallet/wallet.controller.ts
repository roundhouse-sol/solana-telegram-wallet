import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateAccountSchema } from '../accounts/accounts.dto';
import { z } from 'zod';

@Controller('api')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Post("/:id/sign")
  async create(@Param('id') id: string) {
    return this.walletService.createOrGetAccount(id, id, {userId: id})
  }

  @Post("/sing")
  async getAccount(@Body() account: z.infer<typeof CreateAccountSchema>) {
    return this.walletService.getAccountWallet(account.userId)
  }

  @Post("/:id/balance")
  async getBalance(@Param('id') id: string) {
    return this.walletService.getBalanceAccount(id)
  }

  @Post("/send/transaction")
  async sendTransaction(@Body() account: {userId: string, wallet: string, amount: string}) {
    return this.walletService.sendTransaction(account.userId, account.wallet, Number(account.amount))
  }

}