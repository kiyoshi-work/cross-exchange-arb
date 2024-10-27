import WebSocket from 'ws';
import zlib from 'zlib';
import axios from 'axios';

let socketBingX;
let socketMEXC;
const _baseUrl = `http://localhost:${process.env.PORT || 8011}`;

function onOpenBingX() {
  console.log("WebSocket connected");
  socketBingX.send(JSON.stringify(
    {
      "dataType": "spot.depth2.MYRO_USDT.0.00001",
      "data": {
        "depth": 5,
        "aggPrecision": "0.00001"
      },
      "id": "3c062bfa-a0d0-49fe-a8ab-e46889a77ee0",
      "reqType": "sub"
    }
  ));
}

function onOpenMEXC() {
  console.log("WebSocket MEXC connected");
  socketMEXC.send(JSON.stringify(
    {
      "method": "SUBSCRIPTION",
      "params": [
        "spot@public.limit.depth.v3.api@MYROUSDT@5"
      ]
    }
  ));
}

function onCloseBingX() {
  console.log("WebSocket closed");
  setTimeout(function () {
    connectBingX();
  }, 1000);
}

function onError(error) {
  console.log("WebSocket error:", error);
}

async function onMessageMEXC(message) {
  let _message = JSON.parse(message)
  const asks = _message['d']?.asks;
  const bids = _message['d']?.bids;
  const symbol = _message['s'];
  if (asks && asks.length && bids && bids.length) {
    const lastAsk = asks[asks.length - 1];
    const firstBid = bids[0];
    console.log(`MEXC: BAN ${lastAsk.p} : ${lastAsk.v} ----- MUA: ${firstBid.p} : ${firstBid.v}`);
    const options = {
      method: 'POST',
      url: `${_baseUrl}/arbitrage-demo`,
      timeout: 1000,
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        symbol: symbol,
        exchange: 'MEXC',
        thresh: {
          amount_bid: Number(firstBid.v),
          price_bid: Number(firstBid.p),
          amount_ask: Number(lastAsk.v),
          price_ask: Number(lastAsk.p),
          updated_at: new Date(),
        },
        top_ask: asks.map(_ask => ({ amount: Number(_ask.v), price: Number(_ask.p) })),
        top_bid: bids.map(_bid => ({ amount: Number(_bid.v), price: Number(_bid.p) }))
      },
    };
    try {
      await axios.request(options);
    } catch (error) {
      console.log("🚀 ~ file: listen.ts:84 ~ onMessageMEXC ~ error:", error)
    }
  }
}


async function onMessageBingX(message) {
  const buf = Buffer.from(message);
  const decodedMsg = zlib.gunzipSync(buf).toString('utf-8');
  if (decodedMsg === "Ping") {
    socketBingX.send('Pong');
    console.log('Pong');
  } else {
    let _decodedMsg = JSON.parse(decodedMsg)
    const asks = _decodedMsg['data']?.asks;
    const bids = _decodedMsg['data']?.bids;
    const symbol = _decodedMsg['data']?.symbol;
    if (asks && asks.length && bids && bids.length) {
      const lastAsk = asks[asks.length - 1];
      const firstBid = bids[0];
      console.log(`BINGX: BAN ${lastAsk.price} : ${lastAsk.amount} ----- MUA: ${firstBid.price} : ${firstBid.amount}`);
      const options = {
        method: 'POST',
        url: `${_baseUrl}/arbitrage-demo`,
        timeout: 1000,
        headers: {
          'Content-Type': 'application/json',
        },
        data: {
          symbol: symbol,
          exchange: 'BINGX',
          thresh: {
            amount_bid: Number(firstBid.amount),
            price_bid: Number(firstBid.price),
            amount_ask: Number(lastAsk.amount),
            price_ask: Number(lastAsk.price),
            updated_at: new Date(),
          },
          top_ask: asks.map(_ask => ({ amount: Number(_ask.amount), price: Number(_ask.price) })),
          top_bid: bids.map(_bid => ({ amount: Number(_bid.amount), price: Number(_bid.price) }))
        },
      };
      try {
        await axios.request(options);
      } catch (error) {
        console.log("🚀 ~ file: listen.ts:124 ~ onMessageBingX ~ error:", error)
      }
    }
  }
}

const connectBingX = () => {
  // socket = new WebSocket('wss://open-api-swap.bingx.com/swap-market'); // Use your server's address
  socketBingX = new WebSocket('wss://ws-spot.we-api.com/market', {
    headers: {
      'Origin': 'https://bingx.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
    }
  }); // Use your server's address
  socketBingX.on('open', onOpenBingX);
  socketBingX.on('message', onMessageBingX);
  socketBingX.on('error', onError);
  socketBingX.on('close', onCloseBingX);
}

const connectMEXC = () => {
  socketMEXC = new WebSocket('wss://wbs.mexc.com/ws', {
    headers: {
      'Origin': 'https://bingx.com',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0'
    }
  }); // Use your server's address
  socketMEXC.on('open', onOpenMEXC);
  socketMEXC.on('message', onMessageMEXC);
  socketMEXC.on('error', onError);
}

function init() {
  connectBingX();
  connectMEXC();
}


init();