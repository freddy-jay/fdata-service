import config from '../../config/config';

export interface RequestProps {
  symbol: String;
  function: AlphaVantageFunctions;
  interval: AlphaVantageIntervals;
  outputSize: AlphaVantageOutputSize;
}

export class AlphaVantage {
  private url = 'https://www.alphavantage.co';

  async fetchData(props: RequestProps): Promise<ApiData[]> {
    return fetch(
      this.composeRequestUrl(
        props.symbol,
        props.function,
        props.interval,
        props.outputSize
      ),
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
        const timeSeries = data[`Time Series (${props.interval})`];
        const flattenedTimeSeries: ApiData[] = [];

        Object.keys(timeSeries).forEach(key => {
          const values: AlphaVantageDataValues = timeSeries[key];
          flattenedTimeSeries.push(
            this.responseToApiData(key, values, props.symbol)
          );
        });

        return flattenedTimeSeries;
      });
  }

  private composeRequestUrl(
    symbol: String,
    apiFunction: AlphaVantageFunctions,
    interval: AlphaVantageIntervals,
    outputSize: AlphaVantageOutputSize
  ): RequestInfo {
    const url = `${this.url}/query?function=${apiFunction}&symbol=${symbol}&apikey=${config.AlphaVantageKey}&outputsize=${outputSize}`;

    if (apiFunction === AlphaVantageFunctions.DAILY) {
      return url;
    } else {
      return url + `&interval=${interval}`;
    }
  }

  private responseToApiData(
    key: String,
    values: AlphaVantageDataValues,
    symbol: String
  ): ApiData {
    return {
      datetime: key,
      symbol: symbol,
      open: values['1. open'],
      high: values['2. high'],
      low: values['3. low'],
      close: values['4. close'],
      volume: values['5. volume'],
    };
  }
}

type AlphaVantageDataValues = {
  '1. open': Number;
  '2. high': Number;
  '3. low': Number;
  '4. close': Number;
  '5. volume': Number;
};

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

export enum AlphaVantageOutputSize {
  COMPACT = 'compact',
  FULL = 'full',
}

export type ApiData = {
  datetime: String;
  symbol: String;
  open: Number;
  high: Number;
  low: Number;
  close: Number;
  volume: Number;
};
