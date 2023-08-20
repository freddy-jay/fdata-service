import * as dotenv from 'dotenv';

dotenv.config({path: '.env'});

export default {
  AlphaVantageKey: process.env.ALPHA_VANTAGE_KEY ?? undefined,
};
