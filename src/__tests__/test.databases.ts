// test database.ts DataStore class
import {DataStore} from '../data/database';

describe('DataStore', () => {
  const dbName = 'test.db';
  const dataStore = new DataStore(dbName);

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
    dataStore.createTable();
  });

  afterAll(() => {
    dataStore.close();
    dataStore.deleteDb();
  });

  test('should insert data into database', () => {
    dataStore.insertData(data);
    const insertedData = dataStore.getData();
    expect(insertedData).resolves.toBe(2);
  });

  test('should get data from database', () => {
    const insertedData = dataStore.getData();
    expect(insertedData).resolves.toEqual(data);
  });

  test('should additional insertion', () => {
    dataStore.insertData(data);
    const insertedData = dataStore.getData();
    expect(insertedData).resolves.toBe(4);
  });
});
