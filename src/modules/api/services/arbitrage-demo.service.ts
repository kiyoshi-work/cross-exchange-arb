import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { CrossExArbiRepository } from "@/database/repositories/cross-ex-arbi.repository";
import TelegramBotApi from "node-telegram-bot-api";
import { ConfigService } from "@nestjs/config";
import TelegramBot from "node-telegram-bot-api";

@Injectable()
export class ArbitrageDemoService implements OnApplicationBootstrap {
  private bot: TelegramBot;

  constructor(
    private readonly configService: ConfigService,
    private readonly crossExArbiRepository: CrossExArbiRepository
  ) {
    // this.run();
    const token = configService.get<string>("telegram.token");
    this.bot = new TelegramBotApi(token, {
      polling: false,
      // polling: true,
      // request: {
      //   url: "",
      //   agentOptions: {
      //     keepAlive: true,
      //     family: 4,
      //   },
      // },
    });
    // this.bot.onText(/\/start/, (msg) => {
    //   console.log(msg);
    // });
    // this.bot.on("message", (msg) => {
    //   console.log(msg);
    // });
    // this.sendArbiAlert("hi");
  }

  async sendArbiAlert(data: string) {
    try {
      return await this.bot.sendMessage(
        this.configService.get<string>("telegram.arbi_alert.chat_id"),
        data,
        {
          message_thread_id: this.configService.get<number>(
            "telegram.arbi_alert.thread_id"
          ),
        }
      );
    } catch (error) {
      console.log(
        "🚀 ~ file: telegram-bot.ts:47 ~ TelegramBot ~ sendNewPoolAlert ~ error:",
        error
      );
    }
  }

  async onApplicationBootstrap() {
    // this.run();
  }

  private _price = {
    MEXC: new Map<
      string,
      {
        thresh: {
          amount_bid: number;
          price_bid: number;
          amount_ask: number;
          price_ask: number;
          updated_at: Date;
        };
        top_ask: { amount: number; price: number }[];
        top_bid: { amount: number; price: number }[];
      }
    >(),
    BINGX: new Map<
      string,
      {
        thresh: {
          amount_bid: number;
          price_bid: number;
          amount_ask: number;
          price_ask: number;
          updated_at: Date;
        };
        top_ask: { amount: number; price: number }[];
        top_bid: { amount: number; price: number }[];
      }
    >(),
  };
  private _alertTime = new Map<string, number>();

  async adaptTrading(data: any) {
    // if (!this._price) {
    //   this._price = {
    //     'MEXC': new Map<string, {
    //       thresh: { amount_bid: number, price_bid: number, amount_ask: number, price_ask: number, updated_at: Date },
    //       top_ask: { amount: number; price: number }[],
    //       top_bid: { amount: number; price: number }[],
    //     }>(),
    //     'BINGX': new Map<string, {
    //       thresh: { amount_bid: number, price_bid: number, amount_ask: number, price_ask: number, updated_at: Date },
    //       top_ask: { amount: number; price: number }[],
    //       top_bid: { amount: number; price: number }[],
    //     }>()
    //   };
    // }
    this._price[data.exchange].set(data.symbol, data);
    await this.snipe(data.symbol);
  }

  async calculatePNL(data: {
    _asks: { amount: number; price: number }[];
    _bids: { amount: number; price: number }[];
    from: string;
    to: string;
    rate: number;
    symbol: string;
  }) {
    let { _asks, _bids } = data;
    _asks = _asks.sort((a, b) => a.price - b.price);
    _bids = _bids.sort((a, b) => b.price - a.price);
    console.log("🚀 ~ file: price.ts:103 ~ _asks, _bids:", _asks, _bids);
    let totalAsk = _asks.reduce((a, b) => a + b.amount, 0);
    let totalBid = _bids.reduce((a, b) => a + b.amount, 0);
    let totalBuyUSD = 0;
    let totalSellUSD = 0;
    if (totalAsk > totalBid) {
      totalSellUSD = _bids.reduce((a, b) => a + b.amount * b.price, 0);
      for (const _ask of _asks) {
        if (totalBid > _ask.amount) {
          totalBuyUSD += _ask.amount * _ask.price;
          totalBid -= _ask.amount;
        } else {
          if (totalBid > 0) {
            totalBuyUSD += totalBid * _ask.price;
          }
          break;
        }
      }
      if (totalSellUSD - totalBuyUSD >= 0) {
        if ((this._alertTime.get(data.symbol) || 0) + 60 * 1000 < Date.now()) {
          const text = `Buy ${totalBid} tokens ${data.symbol}: ${totalBuyUSD} USD,\nPNL: ${totalSellUSD - totalBuyUSD},\n%PL: ${(totalSellUSD - totalBuyUSD) / totalBuyUSD}`;
          this._alertTime.set(data.symbol, Date.now());
          console.log(text);
          await this.sendArbiAlert(
            `${text}\n======\nASKS (${data.from}): ${JSON.stringify(_asks)} \nBIDS (${data.to}): ${JSON.stringify(_bids)}`
          );
        }
        await this.crossExArbiRepository.save({
          symbol: data.symbol,
          from_exchange: data.from,
          to_exchange: data.to,
          thresh_rate: data.rate,
          num_token_shoud_buy: totalBid,
          usd_buy: totalBuyUSD,
          pnl: totalSellUSD - totalBuyUSD,
          pnl_percent: (totalSellUSD - totalBuyUSD) / totalBuyUSD,
          metadata: { top_order: { asks: _asks, bids: _bids } },
        });
      }
    } else {
      totalBuyUSD = _asks.reduce((a, b) => a + b.amount * b.price, 0);
      for (const _bid of _bids) {
        if (totalAsk > _bid.amount) {
          totalSellUSD += _bid.amount * _bid.price;
          totalAsk -= _bid.amount;
        } else {
          if (totalAsk > 0) {
            totalSellUSD += totalAsk * _bid.price;
          }
          break;
        }
      }
      if (totalSellUSD - totalBuyUSD >= 0) {
        if ((this._alertTime.get(data.symbol) || 0) + 60 * 1000 < Date.now()) {
          const text = `Buy ${totalAsk} tokens ${data.symbol}: ${totalBuyUSD} USD,\nPNL: ${totalSellUSD - totalBuyUSD},\n%PL: ${(totalSellUSD - totalBuyUSD) / totalBuyUSD}`;
          this._alertTime.set(data.symbol, Date.now());
          console.log(text);
          await this.sendArbiAlert(
            `${text}\n======\nASKS (${data.from}): ${JSON.stringify(_asks)} \nBIDS (${data.to}): ${JSON.stringify(_bids)}`
          );
        }
        await this.crossExArbiRepository.save({
          symbol: data.symbol,
          from_exchange: data.from,
          to_exchange: data.to,
          thresh_rate: data.rate,
          num_token_shoud_buy: totalAsk,
          usd_buy: totalBuyUSD,
          pnl: totalSellUSD - totalBuyUSD,
          pnl_percent: (totalSellUSD - totalBuyUSD) / totalBuyUSD,
          metadata: { top_order: { asks: _asks, bids: _bids } },
        });
      }
    }
  }

  async snipe(symbol: string) {
    if (
      this._price["MEXC"]?.get(symbol)?.thresh?.price_ask &&
      this._price["BINGX"]?.get(symbol)?.thresh?.price_ask
    ) {
      const _rateBingToMexc =
        this._price["MEXC"].get(symbol).thresh?.price_bid /
        this._price["BINGX"].get(symbol).thresh?.price_ask;
      const _rateMexcToBing =
        this._price["BINGX"].get(symbol).thresh?.price_bid /
        this._price["MEXC"].get(symbol).thresh?.price_ask;
      console.log(
        `🚀 ~ BINGX->MEXC:${_rateBingToMexc} | MEXC->BINGX:${_rateMexcToBing}`
      );
      if (_rateBingToMexc > 1) {
        console.log(
          `RATE: ${_rateBingToMexc.toFixed(4)} ==> BINGX: ${this._price["BINGX"].get(symbol).thresh?.price_ask}*${this._price["BINGX"].get(symbol).thresh?.amount_ask} ---> MEXC: ${this._price["MEXC"].get(symbol).thresh?.price_bid}*${this._price["MEXC"].get(symbol).thresh?.amount_bid}`
        );
        let _asks = [];
        let _bids = [];
        // console.log("🚀 ~ file: price.ts:178 ~ setInterval ~ this._price['MEXC'].get(symbol).thresh:", this._price['BINGX'].get(symbol).top_ask, this._price['MEXC'].get(symbol).thresh, this._price['MEXC'].get(symbol).thresh?.price_bid, this._price['MEXC'].get(symbol).top_bid, this._price['BINGX'].get(symbol).thresh?.price_ask)
        for (const _ask of this._price["BINGX"].get(symbol).top_ask) {
          if (_ask.price < this._price["MEXC"].get(symbol).thresh?.price_bid) {
            _asks.push(_ask);
          }
        }
        for (const _bid of this._price["MEXC"].get(symbol).top_bid) {
          if (_bid.price > this._price["BINGX"].get(symbol).thresh?.price_ask) {
            _bids.push(_bid);
          }
        }
        await this.calculatePNL({
          _asks,
          _bids,
          from: "BINGX",
          to: "MEXC",
          rate: _rateBingToMexc,
          symbol,
        });
      }
      if (_rateMexcToBing > 1) {
        console.log(
          `RATE: ${_rateMexcToBing.toFixed(4)} ==> MEXC: ${this._price["MEXC"].get(symbol).thresh?.price_ask}*${this._price["MEXC"].get(symbol).thresh?.amount_ask} ---> BINGX: ${this._price["BINGX"].get(symbol).thresh?.price_bid}*${this._price["BINGX"].get(symbol).thresh?.amount_bid}`
        );
        let _asks = [];
        let _bids = [];
        // console.log("🚀 ~ file: price.ts:196 ~ setInterval ~ this._price['MEXC'].get(symbol).top_ask:", this._price['MEXC'].get(symbol).top_ask, this._price['BINGX'].get(symbol).thresh?.price_bid, this._price['BINGX'].get(symbol).top_bid, this._price['MEXC'].get(symbol).thresh?.price_ask)
        for (const _ask of this._price["MEXC"].get(symbol).top_ask) {
          if (_ask.price < this._price["BINGX"].get(symbol).thresh?.price_bid) {
            _asks.push(_ask);
          }
        }
        for (const _bid of this._price["BINGX"].get(symbol).top_bid) {
          if (_bid.price > this._price["MEXC"].get(symbol).thresh?.price_ask) {
            _bids.push(_bid);
          }
        }
        await this.calculatePNL({
          _asks,
          _bids,
          from: "MEXC",
          to: "BINGX",
          rate: _rateMexcToBing,
          symbol,
        });
      }
    }
  }
}
