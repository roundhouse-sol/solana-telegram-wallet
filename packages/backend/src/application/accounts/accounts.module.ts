import { Module } from '@nestjs/common';
import { AccountsService } from './accounts.service';
import { AccountsController } from './accounts.controller';
import { FirebaseService } from '../firebase/firebase.service';

@Module({
  imports: [],
  controllers: [AccountsController],
  providers: [
    AccountsService
  ],
})
export class AccountsModule {}
