import { FastifyInstance } from 'fastify'
import { PrismaClient } from 'generated/prisma'
import { PrismaCustomerRepository } from '@/domain/repositories/prisma/prisma-customer-repository'
import { GetCustomerByMSISDN } from '@/use-case/GetCustomerByMSISDN'

export async function customerRoutes(app: FastifyInstance) {
  const prisma = new PrismaClient()
  const customerRepository = new PrismaCustomerRepository(prisma)
  const getCustomerByMSISDN = new GetCustomerByMSISDN(customerRepository)

  // Health check endpoint
  app.get('/health', async (request, reply) => {
    try {
      // Test database connection
      await prisma.$queryRaw`SELECT 1`
      return reply.status(200).send({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'aicc-bradesco',
      })
    } catch (error) {
      return reply.status(503).send({
        status: 'unhealthy',
        error: 'Database connection failed',
        timestamp: new Date().toISOString(),
      })
    }
  })

  // Get customer by MSISDN
  app.get('/customers', async (request, reply) => {
    try {
      const { msisdn } = request.query as { msisdn: string }

      if (!msisdn) {
        return reply.status(400).send({
          error: 'MSISDN parameter is required',
        })
      }

      const customer = await getCustomerByMSISDN.execute(msisdn)

      if (!customer) {
        return reply.status(404).send({
          error: 'Customer not found',
          msisdn,
        })
      }

      return reply.status(200).send(customer)
    } catch (error) {
      console.error('Error fetching customer:', error)
      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  })
}
