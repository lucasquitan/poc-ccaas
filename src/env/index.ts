// Import dotenv to load environment variables from .env file
import 'dotenv/config'

// Import zod for runtime type checking
import { z } from 'zod'

// Define schema for environment variables
const envSchema = z.object({
  // NODE_ENV must be one of: 'dev', 'test', 'production'
  // Defaults to 'dev' if not specified
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),

  // PORT must be a number, will be coerced from string if needed
  // Defaults to 3333 if not specified
  PORT: z.coerce.number().default(3333),

  // Variables for PostgreSQL connection
  DATABASE_URL: z.string(),
  POSTGRES_USER: z.string(),
  POSTGRES_PASSWORD: z.string(),
  POSTGRES_DATABASE: z.string(),

  // Optional debug mode for enhanced logging
  DEBUG_MODE: z.coerce.boolean().default(false),
})

// Validate environment variables against schema
const _env = envSchema.safeParse(process.env)

// If validation fails, log error details and throw
if (!_env.success) {
  console.error('❌ Invalid environment variables', _env.error.format())

  throw new Error('Invalid environment variables.')
}

// Log running mode based on NODE_ENV
if (_env.data.NODE_ENV === 'dev') {
  console.log('🚧 Running in development mode')
}

if (_env.data.DEBUG_MODE) {
  console.log('🪲 Running in debug mode')
}

if (_env.data.NODE_ENV === 'test') {
  console.log('🧪 Running in test mode')
}

if (_env.data.NODE_ENV === 'production') {
  console.log('🚀 Running in production mode')
}

// Export validated environment variables
export const env = _env.data
