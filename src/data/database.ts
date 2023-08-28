import * as sqlite3 from 'sqlite3';
import * as fs from 'fs';
import * as path from 'path';
import {ApiData} from './apis/alphavantage';

export enum Tables {
  DAILY = 'stocks_daily',
  INTRADAY = 'stocks_intraday',
}
export class DataStore {
  private db: sqlite3.Database;
  private dbName: string;

  constructor(dbName: string) {
    this.dbName = dbName;
    const dbPath = path.join(__dirname, dbName);
    this.db = new sqlite3.Database(dbPath);
  }

  async createDailyTable() {
    const sql = `CREATE TABLE IF NOT EXISTS ${Tables.DAILY} (
      datetime TEXT,
      symbol TEXT,
      open REAL,
      high REAL,
      low REAL,
      close REAL,
      volume INTEGER,
      PRIMARY KEY (datetime, symbol)
    )`;

    this.db.serialize(() => {
      this.db.run(sql);
      this.db.run(
        `CREATE INDEX IF NOT EXISTS datetime_idx ON ${Tables.DAILY} (datetime)`
      );
      this.db.run(
        `CREATE INDEX IF NOT EXISTS symbol_idx ON ${Tables.DAILY} (symbol)`
      );
    });
  }

  async insertData(data: ApiData[], table: Tables) {
    const sql = `INSERT INTO ${table} VALUES (?, ?, ?, ?, ?, ?, ?)`;
    data.forEach(async d => {
      await this.db.run(
        sql,
        [d.datetime, d.symbol, d.open, d.high, d.low, d.close, d.volume],
        function (err) {
          if (err) {
            console.error(err.message);
          }
          console.log(`${this.changes}`);
        }
      );
    });
  }

  getData(table: Tables): Promise<ApiData[]> {
    return new Promise((resolve, reject) => {
      const sql = `SELECT * FROM ${table}`;
      this.db.all(sql, [], (err, rows) => {
        if (err) {
          console.error(err.message);
          reject(err);
        }
        const apiData: ApiData[] = [];
        (rows as ApiData[]).forEach(row => {
          apiData.push({
            datetime: row.datetime,
            symbol: row.symbol,
            open: row.open,
            high: row.high,
            low: row.low,
            close: row.close,
            volume: row.volume,
          });
        });
        resolve(apiData);
      });
    });
  }

  async deleteDb() {
    const dbPath = path.join(__dirname, this.dbName);
    fs.unlinkSync(dbPath);
  }

  close() {
    this.db.close();
  }
}
