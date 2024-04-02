import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { BotService } from './bot.service';

const token = {
    useFactory: () => ({
        token: process.env.TOKEN_BOT_TELEGRAM
    })
}

@Module({
  imports: [
    TelegrafModule.forRootAsync(token),
  ],
  controllers: [],
  providers: [
    BotService
  ],
})
export class BotModule {}
