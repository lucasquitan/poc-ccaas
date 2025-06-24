import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'
import { env } from '@/env'

interface LogData {
  timestamp: string
  ip: string
  method: string
  url: string
  statusCode: number
  responseTime: number
  userAgent?: string
  payload?: any
}

// Map to store request start times
const requestTimers = new Map<string, number>()

export function setupLogger(app: FastifyInstance) {
  // Hook before request processing
  app.addHook('preHandler', async (request: FastifyRequest) => {
    const requestId = request.id
    requestTimers.set(requestId, Date.now())

    // Log request start if DEBUG_MODE is enabled
    if (env.DEBUG_MODE) {
      const logData: Partial<LogData> = {
        timestamp: new Date().toISOString(),
        ip: request.ip || request.socket.remoteAddress || 'unknown',
        method: request.method,
        url: request.url,
        userAgent: request.headers['user-agent'],
      }

      // Capture payload
      if (request.body) {
        logData.payload = request.body
      }
      if (request.query) {
        logData.payload = { ...logData.payload, query: request.query }
      }
      if (request.params) {
        logData.payload = { ...logData.payload, params: request.params }
      }

      if (logData.payload) {
        console.log(
          `📥 Request Payload for ${request.method} ${request.url}:\n${JSON.stringify(logData.payload, null, 2)}`,
        )
      }
    }
  })

  // Hook after response is sent
  app.addHook(
    'onResponse',
    async (request: FastifyRequest, reply: FastifyReply) => {
      const requestId = request.id
      const startTime = requestTimers.get(requestId)

      if (startTime) {
        const endTime = Date.now()
        const responseTime = endTime - startTime
        requestTimers.delete(requestId)

        const logData: LogData = {
          timestamp: new Date().toISOString(),
          ip: request.ip || request.socket.remoteAddress || 'unknown',
          method: request.method,
          url: request.url,
          statusCode: reply.statusCode,
          responseTime,
          userAgent: request.headers['user-agent'],
        }

        // Format and log the message
        const logMessage = formatLogMessage(logData)

        // Log based on status code
        if (logData.statusCode >= 400) {
          console.error(logMessage)
        } else {
          console.log(logMessage)
        }
      }
    },
  )
}

function formatLogMessage(logData: LogData): string {
  const { timestamp, ip, method, url, statusCode, responseTime } = logData

  // Format timestamp for better readability
  const date = new Date(timestamp)
  const formattedTime = date.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  // Base log message
  const message = `[${formattedTime}] ${ip} - ${method} ${url} - ${statusCode} (${responseTime}ms)`

  return message
}

// Utility function to log specific events
export function logEvent(event: string, data?: any) {
  const timestamp = new Date().toISOString()
  const formattedTime = new Date(timestamp).toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })

  let message = `[${formattedTime}] 🔍 ${event}`

  if (env.DEBUG_MODE && data) {
    message += `\n📊 Data: ${JSON.stringify(data, null, 2)}`
  }

  console.log(message)
}

// Utility function to log response payloads
export function logResponsePayload(request: FastifyRequest, payload: any) {
  if (env.DEBUG_MODE) {
    console.log(
      `📤 Response Payload for ${request.method} ${request.url}:\n${JSON.stringify(payload, null, 2)}`,
    )
  }
}
