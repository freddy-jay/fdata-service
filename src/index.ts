import {AlphaVantage} from './data/apis/alphavantage';

export class DataService {
  api: AlphaVantage;

  constructor() {
    this.api = new AlphaVantage();
  }
}
