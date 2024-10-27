# Token Orderbook Listener and Arbitrage Alert

## Overview

This project is designed to listen to the order books of various tokens from multiple exchanges, including BingX and MEXC. The system identifies arbitrage opportunities and sends alerts to Telegram, enabling users to act quickly on potential profit-making trades.

## Features

- Real-time monitoring of token order books from supported exchanges.
- Detection of arbitrage opportunities.
- Instant alerts sent to Telegram for timely actions.
- Easily extendable to monitor additional tokens and exchanges.

## Supported Exchanges

- BingX
- MEXC
- [Add more exchanges as needed]

## Getting Started

### Prerequisites

- Node.js 18

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/kiyoshi-work/cross-exchange-arb.git
   cd cross-exchange-arb
   ```

2. Install the required dependencies:
   ```bash
   npm install
   ```

3. Set up your Telegram bot:
   - Create a new bot using [BotFather](https://core.telegram.org/bots#botfather).
   - Obtain your bot token and chat ID.

4. Configure the bot in your environment:
   - Create a `.env` file in the root directory and add the following:
     ```
     TELEGRAM_TOKEN=your_bot_token
     TELEGRAM_GROUP_ID=your_group_id
     TELEGRAM_THREAD_ID=id_of_topic_in_group
     ```

### Usage

To start the order book listener and arbitrage alert system, run the following command:
```bash
node scripts/aitech.mjs
node scripts/myro.mjs
```

If you want to monitor more tokens, you can create a new file with a similar structure in the `scripts` directory. Each new file should follow the same format as the existing token monitoring scripts.

### TODO

- Add support for more exchanges.
- Implement monitoring for additional tokens.

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
