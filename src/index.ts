import {
  AlphaVantage,
  AlphaVantageFunctions,
  AlphaVantageIntervals,
  AlphaVantageOutputSize,
} from './data/apis/alphavantage';

export class DataService {
  api: AlphaVantage;

  constructor() {
    this.api = new AlphaVantage();
  }
}
