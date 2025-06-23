import { PrismaClient } from 'generated/prisma'
import fs from 'fs'
import path from 'path'

const prisma = new PrismaClient()

const seed = async () => {
  const csvPath = path.join(__dirname, '..', '..', 'seed.csv')
  const csvData = fs.readFileSync(csvPath, 'utf8')
  const lines = csvData.split('\n').slice(1)

  for (const line of lines) {
    if (!line.trim()) continue // Skip empty lines

    const [MSISDN, CPF, CUSNAME, CUSCOMPANY, OPERATOR, OPERATOR_ID] =
      line.split(',')

    // Check if customer already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { MSISDN },
    })

    if (!existingCustomer) {
      await prisma.customer.create({
        data: {
          MSISDN,
          CPF,
          CUSNAME,
          CUSCOMPANY,
          OPERATOR,
          OPERATOR_ID,
        },
      })
      console.log(`Created customer: ${MSISDN}`)
    } else {
      console.log(`Customer already exists: ${MSISDN}`)
    }
  }
}

seed()
  .then(() => {
    console.log('Seed completed')
  })
  .catch((error) => {
    console.error('Seed failed:', error)
    process.exit(1)
  })
  .finally(() => {
    prisma.$disconnect()
  })
