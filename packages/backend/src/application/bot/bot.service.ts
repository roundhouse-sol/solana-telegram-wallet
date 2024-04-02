import { Injectable } from '@nestjs/common';
import { Help, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class BotService {
  @Start()
  async startCommand(ctx: Context) {
    await ctx.reply('Welcome! Carlos');
  }

  @Help()
  async helpCommand(ctx: Context) {
    await ctx.reply('Send me a message!');
  }

  @On('text')
  async onMessage(ctx: Context) {
    await ctx.replyWithHTML(`🎬 <b>Welcome to Movie Matcher!</b> 🎥

    Choose your genres and years, and <b>swipe through</b> our top movie picks. 
    
    To match with <b>friends</b> share the <b>app link</b> - t.me/movie_matcher_test_bot/app.
    
    If you're in the mood for <b>solo</b> discovery, use the <b>menu button</b> 
    
    When everyone <b>swipes right</b> on a movie, it's popcorn time! 
    
    Dive in and elevate your movie nights!
    `);
  }
}