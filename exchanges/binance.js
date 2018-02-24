/**
 * Binance API client.
 */

const request = require('request');
const debug = require('debug')('trader:binance');
const config = require('../config/binance');

const API_URL = 'https://api.binance.com/api';

const MARKETS = ['BTC', 'ETH'];
// const MARKETS = ['BTC', 'ETH', 'BNB', 'USDT'];

const parseMarketName = (str) => {
    const market = MARKETS.filter((o) => {
        return (str.substr(str.length - o.length).toUpperCase() === o);
    }).toString();

    return [market , str.slice(0, -market.length).toUpperCase()];
};

const getMarkets = () => new Promise((resolve, reject) => {

    const url = `${API_URL}/v1/ticker/24hr`;
    debug(`Getting markets list from url ${url}...`);

    request({
        uri: url,
        json: true,
        method: 'GET'
    }, (err, response, body) => {
        if (err) return reject(err);

        if (response.statusCode !== 200) {
            // some other error
            return reject(`Invalid status code received from url ${url}: ${response.statusCode}`);
        }

        if (!body) {
            return reject(`Invalid response: ${JSON.stringify(body)}`);
        }

        // filtering active markets only
        const markets = {};
        let counter = 0;

        for (let mt of body) {
            let [market, ticker] = parseMarketName(mt.symbol);
            if (MARKETS.indexOf(market) === -1) {
                continue;
            }

            if (!markets[market]) {
                markets[market] = [];
            }

            counter += 1;
            markets[market].push(ticker);
        }

        debug(`Found ${counter} markets`);

        resolve(markets);

    });

});

const getCandlestickData = (market, ticker) => new Promise((resolve, reject) => {
    let marketTicker = ticker + market;
    const url = `${API_URL}/v1/klines?symbol=${ticker}${market}&interval=${config.getCandlestickData.interval}&limit=${config.getCandlestickData.limit}`;
    debug(`Getting candlestick data for market ${marketTicker} from url ${url}...`);

    const mapData = (o) => {
        return {
            openTime: new Date(o[0]).toString(),
            openTimeTimestamp: o[0],
            openPrice: Number(o[1]),
            highPrice: Number(o[2]),
            lowPrice: Number(o[3]),
            closePrice: Number(o[4]),
            volume: Number(o[5]),
            closeTime:  new Date(o[6]).toString(),
            closeTimeTimestamp:  o[6],
            quoteAssetVolume: Number(o[7]),
            tradesNumber: o[8],
            takerBuyBaseAssetVolume: Number(o[9]),
            takerBuyQuoteAssetVolume: Number(o[10])
        };
    };

    request({
        uri: url,
        json: true,
        method: 'GET'
    }, (err, response, body) => {
        if (err) return reject(err);

        if (response.statusCode !== 200) {
            return reject(`Invalid status code received from url ${url}: ${response.statusCode}`);
        }

        if (!body) {
            return reject(`Invalid response: ${JSON.stringify(body)}`);
        }

        // formatting response
        const res = {
            market: market,
            ticker: ticker,
            data: body ? body.map(mapData).reverse() : []
        };

        resolve(res);
    });

});

module.exports = {

    allowedMarkets: MARKETS,

    getMarkets: getMarkets,

    getCandlestickData: getCandlestickData,

};