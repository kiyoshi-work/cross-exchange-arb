import { registerAs } from "@nestjs/config";

export const configTelegram = registerAs("telegram", () => ({
  token: process.env.TELEGRAM_TOKEN,
  arbi_alert: {
    chat_id: process.env.TELEGRAM_GROUP_ID || -1002103555207,
    thread_id: process.env.TELEGRAM_THREAD_ID || 10,
  },
}));
