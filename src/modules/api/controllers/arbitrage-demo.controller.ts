import { Body, Controller, Inject, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ArbitrageDemoService } from '../services/arbitrage-demo.service';

@ApiTags('Arbt')
@Controller('/arbitrage-demo')
export class ArbitrageDemoController {
  @Inject(ArbitrageDemoService)
  private readonly arbitrageDemoService: ArbitrageDemoService;

  @Post()
  async runArbitrageDemo(@Body() body: any) {
    await this.arbitrageDemoService.adaptTrading(body);
    return {
      statusCode: 1,
    };
  }
}