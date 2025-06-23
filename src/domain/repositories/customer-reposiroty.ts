import { Customer } from '@/domain/entities/Customer'

export interface CustomerRepository {
  findByMSISDN(MSISDN: string): Promise<Customer | null>
}
