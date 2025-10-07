export interface Currency {
	Id: number;
	Name: string;
	Symbol: string;
	LogoUrl: string;
	Type: string;
	PaymentInstruction: string;
}

export interface CreateUpdateCurrency {
  Name: string;
  Symbol: string;
  LogoUrl: string;
  Type: string;
}




