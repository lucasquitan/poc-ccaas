import fastify from 'fastify'
import { customerRoutes } from './routes/customer-routes'

const app = fastify()
app.register(customerRoutes)

export default app
