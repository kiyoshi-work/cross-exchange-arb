import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/database';
import { ApiModule } from '@/api';

@Module({
  imports: [DatabaseModule, ApiModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
