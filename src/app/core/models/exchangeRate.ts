import { Currency } from "./currencies";

export interface ExchangeRate {
  Id: number;
  CurrencyId: number;
  WeBuyAt: number;
  WeSellAt: number;
  MaxTransactionAmount: number;
  MinTransactionAmount: number;
  Currency: Currency;
}


export interface ExchangePair {
  Id: number;
  FromCurrencyId: number;
  ToCurrencyId: number;
  Rate: number;
  MinAmount: number;
  MaxAmount: number;
	FixedFee: number;
	PercentageFee: number;
	FeeNotice?: string;
	FromCurrency: Currency;
	ToCurrency: Currency;
}

