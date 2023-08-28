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
  private DB_FOLDER = './db/';

  dbPath: string;

  constructor(dbName: string) {
    this.dbName = dbName;
    this.createDbFolder();
    this.dbPath = path.join(this.DB_FOLDER, this.dbName);
    this.db = new sqlite3.Database(this.dbPath);
  }

  private createDbFolder() {
    if (!fs.existsSync(this.DB_FOLDER)) {
      fs.mkdirSync(this.DB_FOLDER);
    }
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

  insertRows(data: ApiData[], table: Tables) {
    return Promise.all(data.map(d => this.insertRow(d, table))).then(result => {
      return result.reduce(
        (sum, current) => (sum as number) + (current as number),
        0
      );
    });
  }

  insertRow(data: ApiData, table: Tables) {
    return new Promise((resolve, reject) => {
      const sql = `INSERT INTO ${table} VALUES (?, ?, ?, ?, ?, ?, ?)`;
      this.db.run(
        sql,
        [
          data.datetime,
          data.symbol,
          data.open,
          data.high,
          data.low,
          data.close,
          data.volume,
        ],
        function (err) {
          if (err) {
            return reject(err);
          }
          resolve(this.changes);
        }
      );
    });
  }

  getSymbol(
    symbol: string,
    table: Tables,
    dateRange?: {startDate: string; endDate: string}
  ): Promise<ApiData[]> {
    if (dateRange) {
      return this.getRows(
        `SELECT * FROM ${table} WHERE symbol = ? AND datetime BETWEEN ? AND ?`,
        [symbol, dateRange.startDate, dateRange.endDate]
      );
    }
    return this.getRows(`SELECT * FROM ${table} WHERE symbol = ?`, [symbol]);
  }

  getAllRows(table: Tables): Promise<ApiData[]> {
    return this.getRows(`SELECT * FROM ${table}`, []);
  }

  private getRows(sql: string, params: string[]): Promise<ApiData[]> {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
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
    fs.unlinkSync(this.dbPath);
  }

  close() {
    this.db.close();
  }
}
