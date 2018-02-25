/**
 * Signals Analyzer
 *
 * 0 => today
 * 1 => yesterday
 */

const debug = require('debug')('trader:signals');

/**
 * THE FORMULA
 * (O1>C1) and
 * (O0<C1) and
 * (C0>O1)
 * Yesterday's open is greater than yesterday's close - O1 > C1
 * Today's open is less than yesterday's close - O0 < C1
 * Today's close is greater than yesterday's open. - C0 > O1
 *
 * Prev day is usually a pretty small price change
 * The more uptrend => more bullish
 */
const isECBullish = (tickerData) => {
    let data = tickerData.data;
    return data[1].openPrice > data[1].closePrice &&
        data[0].openPrice < data[1].closePrice &&
        data[0].closePrice > data[1].openPrice;
};

/**
 * THE FORMULA
 * (O1<C1) and
 * (O0>C1) and
 * (C0<O1)
 * Yesterday's close is greater than yesterday's open;
 * Today's open is greater than yesterday's close;
 * Today's close is less than yesterday's open.
 */
const isECBearish = (tickerData) => {
    let data = tickerData.data;
    return data[1].openPrice < data[1].closePrice &&
        data[0].openPrice > data[1].closePrice &&
        data[0].closePrice < data[1].openPrice;
};

module.exports = {

    isECBullish: isECBullish,

    isECBearish: isECBearish

};