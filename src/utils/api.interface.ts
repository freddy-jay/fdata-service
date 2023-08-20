import config from '../config/config';
import {Database} from 'sqlite3';

interface ApiInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchData(...args: any[]): Promise<ApiData[]>;
}

type ApiData = {
  date: String;
  time: String;
  symbol: String;
  open: Number;
  high: Number;
  low: Number;
  close: Number;
  volume: Number;
};

export class AlphaVantageApi implements ApiInterface {
  private url = 'https://www.alphavantage.co';

  async fetchData(
    symbol: String,
    apiFunction: AlphaVantageFunctions,
    interval: AlphaVantageIntervals
  ): Promise<ApiData[]> {
    return fetch(
      `${this.url}/query?function=${apiFunction}&symbol=${symbol}&apikey=${config.AlphaVantageKey}`,
      {
        method: 'GET',
        headers: {
          'User-Agent': 'request',
          Accept: 'application/json',
        },
      }
    )
      .then(response => {
        return response.json();
      })
      .then(data => {
        const timeSeries = data[`Time Series (${interval})`];
        const flattenedTimeSeries: ApiData[] = [];
        Object.keys(timeSeries).forEach(key => {
          const values = timeSeries[key];
          flattenedTimeSeries.push(this.responseToApiData(key, values, symbol));
        });
        return flattenedTimeSeries;
      });
  }

  private responseToApiData(key: String, values: any, symbol: String) {
    return {
      date: key,
      time: key,
      symbol: symbol,
      open: values['1. open'],
      high: values['2. high'],
      low: values['3. low'],
      close: values['4. close'],
      volume: values['5. volume'],
    };
  }
}

export enum AlphaVantageFunctions {
  DAILY = 'TIME_SERIES_DAILY',
  INTRADAY = 'TIME_SERIES_INTRADAY',
}

export enum AlphaVantageIntervals {
  DAILY = 'Daily',
  MIN_1 = '1min',
  MIN_5 = '5min',
  MIN_15 = '15min',
  MIN_30 = '30min',
  MIN_60 = '60min',
}
