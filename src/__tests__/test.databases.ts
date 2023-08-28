// test database.ts DataStore class
import {DataStore, Tables} from '../data/database';
import * as fs from 'fs';

describe('DataStore', () => {
  const dbName = 'test.db';
  let dataStore: DataStore;

  const data = [
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
    // dataStore.deleteDb();
  });

  it('should create a database', () => {
    expect(fs.existsSync(dataStore.dbPath)).toBe(true);
  });
});
