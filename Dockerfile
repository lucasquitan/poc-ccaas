# Build stage
FROM node:20-alpine AS builder

WORKDIR /usr/app

# Install dependencies for build
RUN apk add --no-cache python3 make g++

# Copy package files first for better caching
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma client
RUN npm run prisma:generate

# Build the application
RUN npm run build

# Production stage
FROM node:20-alpine AS production

# Install netcat for database connectivity check
RUN apk add --no-cache netcat-openbsd

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /usr/app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy built application from builder stage
COPY --from=builder /usr/app/build ./build
COPY --from=builder /usr/app/generated ./generated
COPY --from=builder /usr/app/prisma ./prisma

# Copy seed data
COPY seed.csv ./

# Copy entrypoint script
COPY docker-entrypoint.sh ./

# Make entrypoint script executable
RUN chmod +x docker-entrypoint.sh

# Change ownership to non-root user
RUN chown -R nodejs:nodejs /usr/app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3333

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3333/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })" || exit 1

# Use the entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]