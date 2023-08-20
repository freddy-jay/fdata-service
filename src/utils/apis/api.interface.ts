export interface ApiInterface {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchData(...args: any[]): Promise<ApiData[]>;
}

export type ApiData = {
  date: String;
  time: String;
  symbol: String;
  open: Number;
  high: Number;
  low: Number;
  close: Number;
  volume: Number;
};
