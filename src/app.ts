import fastify from 'fastify'
import { customerRoutes } from './routes/customer-routes'
import { setupLogger } from './middleware/logger'

const app = fastify({
  logger: false, // Disable default Fastify logger to use our custom one
})

// Setup custom logging middleware
setupLogger(app)

// Register routes
app.register(customerRoutes)

export default app
