import { PrismaClient } from 'generated/prisma'
import { CustomerRepository } from '../customer-reposiroty'
import { Customer } from '@/domain/entities/Customer'

export class PrismaCustomerRepository implements CustomerRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findByMSISDN(MSISDN: string): Promise<Customer | null> {
    const data = await this.prisma.customer.findUnique({
      where: {
        MSISDN,
      },
    })

    if (!data) return null

    return new Customer(
      data.MSISDN,
      data.CPF,
      data.CUSNAME,
      data.CUSCOMPANY,
      data.OPERATOR,
      data.OPERATOR_ID,
    )
  }
}
