import { Module, OnApplicationBootstrap } from "@nestjs/common";
import { DatabaseModule } from "@/database";
import { ConfigModule } from "@nestjs/config";
import { ArbitrageDemoService } from "./services/arbitrage-demo.service";
import { ScheduleModule } from "@nestjs/schedule";
import { ArbitrageDemoController } from "./controllers/arbitrage-demo.controller";
import { configTelegram } from "./configs";

@Module({
  imports: [
    DatabaseModule,
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [configTelegram],
    }),
  ],
  controllers: [ArbitrageDemoController],
  providers: [ArbitrageDemoService],
})
export class ApiModule implements OnApplicationBootstrap {
  constructor(private arbitrageDemoService: ArbitrageDemoService) {}

  async onApplicationBootstrap() {}
}
