import config from '../config/config';
import {
  AlphaVantage,
  AlphaVantageFunctions,
  AlphaVantageIntervals,
  AlphaVantageOutputSize,
} from '../data/apis/alphavantage';

describe('alpha vantage get data', () => {
  test('test api key found', () => {
    expect(config.AlphaVantageKey).toBeDefined();
  });

  test('test api works', async () => {
    const api = new AlphaVantage();
    const data = api.fetchData({
      symbol: 'IBM',
      function: AlphaVantageFunctions.DAILY,
      interval: AlphaVantageIntervals.DAILY,
      outputSize: AlphaVantageOutputSize.COMPACT,
    });
    await expect(data).resolves.toBeDefined();
    expect((await data).at(0)?.symbol).toBe('IBM');
    expect((await data).at(0)?.open).toBeDefined();
  });
});
