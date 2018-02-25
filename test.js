const sleep = require('system-sleep');

const debug = require('debug')('trader:test');
const signals = require('./lib/signals');
const exchanges = require('./index');
const exchange = exchanges.Binance;

async function init() {
    let markets = await exchange.getMarkets();

    let results = [];
    let counter = 0;
    for (let market in markets) {
        for (let ticker of markets[market]) {

            counter += 1;
            let candleStickData = await  exchange.getCandlestickData(market, ticker);
            let candleStickSignals = signals.getAllSignals(candleStickData);
            // debug(counter, market, ticker, candleStickSignals);
            if (candleStickSignals.isBullishEC || candleStickSignals.isHammer || candleStickSignals.isHM) {
                results.push({
                    market: market,
                    ticker: ticker,
                    signals: candleStickSignals
                });
            }
            sleep(500);

        }
    }

    debug(results);
}

init();