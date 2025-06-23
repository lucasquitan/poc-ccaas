import { Customer } from '@/domain/entities/Customer'
import { CustomerRepository } from '@/domain/repositories/customer-reposiroty'

export class GetCustomerByMSISDN {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async execute(MSISDN: string): Promise<Customer | null> {
    return this.customerRepository.findByMSISDN(MSISDN)
  }
}
