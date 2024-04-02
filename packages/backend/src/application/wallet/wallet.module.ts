import { Module } from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';

@Module({
  imports: [],
  controllers: [WalletController],
  providers: [
    WalletService,
    FirebaseService
  ],
})
export class WalletModule {}
