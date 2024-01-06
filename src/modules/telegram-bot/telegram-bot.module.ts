import { Module, OnApplicationBootstrap } from '@nestjs/common';
import { TelegramBot } from '@/telegram-bot/telegram-bot';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configTelegram } from '@/telegram-bot/configs/telegram';
import { HandlerService } from './services/handler.service';
import { StartHandler } from './handlers';

const handlers = [HandlerService, StartHandler];

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configTelegram],
    }),
  ],
  controllers: [],
  providers: [
    ...handlers,
    TelegramBot,
  ],
  exports: [TelegramBot],
})
export class TelegramBotModule implements OnApplicationBootstrap {
  constructor(
    private telegramBot: TelegramBot,
    private handlerService: HandlerService,
  ) { }

  async onApplicationBootstrap() {
    const handlers = this.handlerService.getHandlers();
    this.telegramBot.registerHandlers(handlers);
    await this.telegramBot.start();
  }
}
