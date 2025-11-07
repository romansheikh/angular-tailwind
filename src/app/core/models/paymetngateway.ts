export interface Instruction {
	BankName?: any;
	AccountHolder?: any;
	AccountNumber?: any;
	Branch?: any;
	PaymentType: string;
	Instruction?: any;
	WalletAddress?: any;
}

export interface PaymentGateway {
	PaymentDetailsId: number;
	CurrencyId: number;
	GatewayName: string;
	AccountNumber: string;
	Title: string;
	Instructions: Instruction;
}