export class Customer {
  constructor(
    public readonly MSISDN: string,
    public readonly CPF: string,
    public readonly CUSNAME: string,
    public readonly CUSCOMPANY: string,
    public readonly OPERATOR: string,
    public readonly OPERATOR_ID: string,
  ) {}
}
