import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BotModule } from './application/bot/bot.module';
import { AccountsModule } from './application/accounts/accounts.module';
import { WalletModule } from './application/wallet/wallet.module';
import { FirebaseService } from './application/firebase/firebase.service';

@Module({
  imports: [
    ConfigModule.forRoot({ cache: true }),
    BotModule,
    WalletModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
