import { FastifyInstance } from 'fastify'
import { PrismaClient } from 'generated/prisma'
import { PrismaCustomerRepository } from '@/domain/repositories/prisma/prisma-customer-repository'
import { GetCustomerByMSISDN } from '@/use-case/GetCustomerByMSISDN'
import { logEvent, logResponsePayload } from '@/middleware/logger'

export async function customerRoutes(app: FastifyInstance) {
  const prisma = new PrismaClient()
  const customerRepository = new PrismaCustomerRepository(prisma)
  const getCustomerByMSISDN = new GetCustomerByMSISDN(customerRepository)

  // Health check endpoint
  app.get('/health', async (request, reply) => {
    logEvent('Health check requested')

    try {
      // Test database connection
      await prisma.$queryRaw`SELECT 1`
      logEvent('Health check successful - database connected')

      const response = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        service: 'aicc-bradesco',
      }

      // Log response payload in debug mode
      logResponsePayload(request, response)

      return reply.status(200).send(response)
    } catch (error) {
      logEvent('Health check failed - database connection error', {
        error: error instanceof Error ? error.message : 'Unknown error',
      })

      return reply.status(503).send({
        status: 'unhealthy',
        error: 'Database connection failed',
        timestamp: new Date().toISOString(),
      })
    }
  })

  // Get customer by MSISDN
  app.get('/customers', async (request, reply) => {
    const { msisdn } = request.query as { msisdn: string }

    logEvent('Customer lookup requested', { msisdn })

    try {
      if (!msisdn) {
        logEvent('Customer lookup failed - missing MSISDN parameter')
        return reply.status(400).send({
          error: 'MSISDN parameter is required',
        })
      }

      const customer = await getCustomerByMSISDN.execute(msisdn)

      if (!customer) {
        logEvent('Customer not found', { msisdn })
        return reply.status(404).send({
          error: 'Customer not found',
          msisdn,
        })
      }

      logEvent('Customer found successfully', {
        msisdn,
        customerMSISDN: customer.MSISDN,
      })

      // Log response payload in debug mode
      logResponsePayload(request, customer)

      return reply.status(200).send(customer)
    } catch (error) {
      logEvent('Customer lookup error', {
        msisdn,
        error: error instanceof Error ? error.message : 'Unknown error',
      })

      console.error('Error fetching customer:', error)
      return reply.status(500).send({
        error: 'Internal server error',
      })
    }
  })
}
