import { Inject, Injectable } from '@nestjs/common';
import { COMMAND_KEYS } from '@/telegram-bot/constants/command-keys';
import {
  Handler,
  StartHandler,
} from '@/telegram-bot/handlers';

@Injectable()
export class HandlerService {
  @Inject(StartHandler)
  private startHandler: StartHandler;

  getHandlers(): Record<string, Handler> {
    return {
      [COMMAND_KEYS.START]: this.startHandler,
    };
  }
}
