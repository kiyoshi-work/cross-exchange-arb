import { Message } from 'node-telegram-bot-api';

export const parserMessageTelegram = (msg: Message) => ({
  messageId: msg.message_id,
  chatId: msg.chat.id,
  telegramId: msg.from.id,
  firstName: msg.from.first_name,
  text: msg.text,
  isInputMessage: !msg?.entities,
  reply_to_message_id: msg?.reply_to_message?.message_id,
});
