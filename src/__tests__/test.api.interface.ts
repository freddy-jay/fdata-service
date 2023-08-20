import {
  AlphaVantageApi,
  AlphaVantageFunctions,
  AlphaVantageIntervals,
} from '../utils/api.interface';
import config from '../config/config';

describe('alpha vantage get data', () => {
  test('test api key found', () => {
    expect(config.AlphaVantageKey).toBeDefined();
  });

  test('test api works', async () => {
    const api = new AlphaVantageApi();
    const data = api.fetchData(
      'IBM',
      AlphaVantageFunctions.DAILY,
      AlphaVantageIntervals.DAILY
    );
    await expect(data).resolves.toBeDefined();
    expect((await data).at(0)?.symbol).toBe('IBM');
  });
});
