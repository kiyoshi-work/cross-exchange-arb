import { registerAs } from '@nestjs/config';

export const configTelegram = registerAs('telegram', () => ({
  token: '6050929742:AAEVIEL133o2wi8-tK89yMdbTZ_1xzQV-KU',
  arbi_alert: {
    chat_id: -1002103555207,
    thread_id: 2,
  },
}));