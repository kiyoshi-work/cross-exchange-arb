import TelegramBotApi, {
  ChatId,
  SendMessageOptions,
} from 'node-telegram-bot-api';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { COMMAND_KEYS } from '@/telegram-bot/constants';
import { parserMessageTelegram } from './utils';
import { Handler } from '@/telegram-bot/handlers';

@Injectable()
export class TelegramBot {
  public telegramIdStatus: Record<string, number> = {};

  private bot: TelegramBotApi;

  private handlers: Record<string, Handler>;

  constructor(private readonly configService: ConfigService) {
    const token = this.configService.get<string>('telegram.token');
    this.bot = new TelegramBotApi(token, { polling: true });
  }

  async sendMessage(
    chatId: ChatId,
    text: string,
    options?: SendMessageOptions,
  ) {
    try {
      return this.bot.sendMessage(chatId, text, options);
    } catch (error) {
      console.log('🚀 ~ file: telegram-bot.ts:89 ~ error:', error);
    }
  }

  async sendArbiAlert(data: string) {
    try {
      return await this.bot.sendMessage(
        this.configService.get<string>('telegram.arbi_alert.chat_id'),
        data,
        {
          message_thread_id: this.configService.get<number>(
            'telegram.arbi_alert.thread_id',
          ),
        },
      );
    } catch (error) {
      console.log(
        '🚀 ~ file: telegram-bot.ts:47 ~ TelegramBot ~ sendNewPoolAlert ~ error:',
        error,
      );
    }
  }

  setupStartCommand(callback: any) {
    this.bot.onText(/\/start/, (msg) => {
      callback(parserMessageTelegram(msg));
    });
  }

  userReply(callback: any) {
    this.bot.on('message', (msg) => {
      callback(parserMessageTelegram(msg));
    });
  }

  registerHandlers(handlers: Record<string, Handler>) {
    this.handlers = handlers;
  }

  async start() {
    const startHandler = this.handlers[COMMAND_KEYS.START];

    if (startHandler) {
      this.setupStartCommand(startHandler.handler);
    }
  }
}
