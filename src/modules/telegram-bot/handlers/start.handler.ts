import { ChatId } from 'node-telegram-bot-api';
import { Inject, Injectable } from '@nestjs/common';
import { TelegramBot } from '@/telegram-bot/telegram-bot';
import { Handler } from './handler';

@Injectable()
export class StartHandler implements Handler {
  @Inject(TelegramBot)
  private readonly bot: TelegramBot;

  handler = async (data: {
    chatId: ChatId;
    telegramId: string;
    firstName: string;
  }) => {
    await this.bot.sendMessage(data.chatId, "Hello");
  };
}
