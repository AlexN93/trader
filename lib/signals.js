/**
 * Signals Analyzer
 */

const debug = require('debug')('trader:signals');

/**
 * THE FORMULA
 * (O-1>C-1) and
 * (O0<C-1) and
 * (C0>O-1)
 * Yesterday's open is greater than yesterday's close;
 * Today's open is less than yesterday's close;
 * Today's close is greater than yesterday's open.
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

module.exports = {

    isECBullish: isECBullish

};