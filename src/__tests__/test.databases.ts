// test database.ts DataStore class
import {DataStore, Tables} from '../data/database';
import * as fs from 'fs';

describe('DataStore', () => {
  const dbName = 'test.db';
  let dataStore: DataStore;

  const data = [
    {
      datetime: '2020-01-01',
      symbol: 'IBM',
      open: 1,
      high: 2,
      low: 3,
      close: 4,
      volume: 5,
    },
    {
      datetime: '2020-01-01',
      symbol: 'AAPL',
      open: 1,
      high: 2,
      low: 3,
      close: 4,
      volume: 5,
    },
    {
      datetime: '2020-01-02',
      symbol: 'AAPL',
      open: 1,
      high: 2,
      low: 3,
      close: 4,
      volume: 5,
    },
  ];

  beforeAll(() => {
    dataStore = new DataStore(dbName);
    dataStore.createDailyTable();
  });

  afterAll(() => {
    dataStore.close();
    dataStore.deleteDb();
  });

  test('should create a database', () => {
    expect(fs.existsSync(dataStore.dbPath)).toBe(true);
  });

  test('should insert rows', () => {
    return dataStore.insertRows(data, Tables.DAILY).then(result => {
      expect(result).toEqual(data.length);
    });
  });

  test('should get all rows', () => {
    return dataStore.getAllRows(Tables.DAILY).then(result => {
      expect(result).toStrictEqual(data);
    });
  });

  test('get all data for symbol', () => {
    const symbol = 'AAPL';
    return dataStore.getSymbol(symbol, Tables.DAILY).then(result => {
      expect(result).toStrictEqual(data.filter(d => d.symbol === symbol));
    });
  });
  test('get all data for symbol in range', () => {
    const symbol = 'AAPL';
    return dataStore
      .getSymbol(symbol, Tables.DAILY, {
        startDate: '2020-01-02',
        endDate: '2020-01-02',
      })
      .then(result => {
        expect(result).toStrictEqual(
          data.filter(d => d.symbol === symbol && d.datetime === '2020-01-02')
        );
      });
  });
});
