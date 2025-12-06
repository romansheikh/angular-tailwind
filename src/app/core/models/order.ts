export interface Order {
    FromCurrencyId: number,
    ToCurrencyId: number,
    AcceptTerm: string,
    AccountHolderName: string,
    AmountReceive: string,
    AmountSend: string,
    BankName: string,
    Branch: string,
    Email: string,
    ExchangeRateApplied: number,
    Name: string,
    PaymentDetailsId: number,
    PaymentProofImageUrl: string,
    Phone: string,
    TransactionProof: string,
    UserReceivingDetails: string
}

