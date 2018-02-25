/**
 * Signals Analyzer
 *
 * 0 => today
 * 1 => yesterday
 */

const debug = require('debug')('trader:signals');

const getAllSignals = (tickerData) => {
    let data = tickerData.data;
    let isDoji = module.exports.isDoji(data[0]);
    let isNearDoji = module.exports.isNearDoji(data[0]);
    let isBullishEC = module.exports.isBullishEC(data[0], data[1]);
    let isBearishEC = module.exports.isBearishEC(data[0], data[1]);
    let isHammer = module.exports.isHammer(data[0]);
    let isInvertedHammer = module.exports.isInvertedHammer(data[0]);
    let isHM = module.exports.isHM(data[0]);

    return {isDoji, isNearDoji, isBullishEC, isBearishEC, isHammer, isInvertedHammer, isHM};
};

/**
 * Doji
 * DOCS -> https://stephenbigalow.com/blog/doji/
 *
 * Formula
 * O = C
 */
const isDoji = (day) => {
    return day.openPrice === day.closePrice;
};

/**
 * Doji and Near Doji
 * DOCS -> https://stephenbigalow.com/blog/doji/
 *
 * Formula
 * ABS(O0 - C0) <= (H0 - L0) * 0.1
 */
const isNearDoji = (day) => {
    return Math.abs(day.openPrice - day.closePrice) <= (day.highPrice - day.lowPrice) * 0.1;
};

/**
 * Bullish Engulfing Candle
 * DOCS -> https://stephenbigalow.com/blog/bullish-engulfing/
 *
 * Formula
 * (C1 < O1) &&
 * (C1 >= O0) &&
 * (C0 >= O1) &&
 * (C0 > O0) &&
 * (C0 - O0) > (O1 - C1)
 *
 * Prev day is usually a pretty small price change
 * The more uptrend => more bullish
 */
const isBullishEC = (day, prevDay) => {
    return prevDay.closePrice < prevDay.openPrice &&
        prevDay.closePrice >=day.openPrice &&
        day.closePrice >= prevDay.openPrice &&
        day.closePrice > day.openPrice &&
        (day.closePrice - day.openPrice) > (prevDay.openPrice - prevDay.closePrice);
};

/**
 * Bearish Engulfing Candle
 * DOCS -> https://stephenbigalow.com/blog/bearish-engulfing/
 *
 * Formula
 * (C1 > O1) &&
 * (C1 <= O0) &&
 * (C0 <= O1) &&
 * (C0 < O0) &&
 * (O0 - C0) > (C1 - O1)
 *
 */
const isBearishEC = (day, prevDay) => {
    return prevDay.closePrice > prevDay.openPrice &&
        prevDay.closePrice <= day.openPrice &&
        day.closePrice <= prevDay.openPrice &&
        day.closePrice < day.openPrice &&
        (day.openPrice - day.closePrice) > (prevDay.closePrice - prevDay.openPrice);
};

/**
 * Hammer
 * DOCS -> https://stephenbigalow.com/blog/hammer-signal/
 *
 * Formula
 * (H0 - L0) > 3 * (O0 - C0) &&
 * (C0 - L0) / (0.001 + H0 - L0) > 0.6 &&
 * (O0 - L0) / (0.001 + H0 - L0) > 0.6
 */
const isHammer  = (day) => {
    return (day.highPrice-day.lowPrice) > 3*(day.openPrice-day.closePrice) &&
        (day.closePrice-day.lowPrice)/(0.001+day.highPrice-day.lowPrice) > 0.6 &&
        (day.openPrice-day.lowPrice)/(0.001+day.highPrice-day.lowPrice) > 0.6;
};

/**
 * Inverted Hammer
 * DOCS -> https://stephenbigalow.com/blog/inverted-hammer/
 *
 * Formula
 * (H0 - L0) > 3 * (O0 - C0) &&
 * (H0 - C0) / (0.001 + H0 - L0) > 0.6 &&
 * (H0 - O0) / (0.001 + H0 - L0) > 0.6
 */
const isInvertedHammer  = (day) => {
    return (day.highPrice-day.lowPrice) > 3*(day.openPrice-day.closePrice) &&
        (day.highPrice-day.closePrice)/(0.001+day.highPrice-day.lowPrice) > 0.6 &&
        (day.highPrice-day.openPrice)/(0.001+day.highPrice-day.lowPrice) > 0.6;
};

/**
 * Hanging Man
 * DOCS -> https://stephenbigalow.com/blog/hanging-man/
 *
 * Formula
 * (H0 - L0) > 4 * (O0 - C0) &&
 * (C0 - L0) / (0.001 + H0 - L0) >= 0.75 &&
 * (O0 - L0) / (0.001 + H0 - L0) >= 0.075
 */
const isHM  = (day) => {
    return (day.highPrice-day.lowPrice)>4*(day.openPrice-day.closePrice) &&
        (day.closePrice-day.lowPrice)/(0.001+day.highPrice-day.lowPrice)>=0.75 &&
        (day.openPrice-day.lowPrice)/(0.001+day.highPrice-day.lowPrice)>=0.75;
};

module.exports = {

    getAllSignals: getAllSignals,

    isDoji: isDoji,

    isNearDoji: isNearDoji,

    isBullishEC: isBullishEC,

    isBearishEC: isBearishEC,

    isHammer: isHammer,

    isInvertedHammer: isInvertedHammer,

    isHM: isHM

};