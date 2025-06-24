#!/bin/sh

set -e

# Wait for database to be ready
echo "Waiting for database to be ready..."
max_attempts=30
attempt=1

while [ $attempt -le $max_attempts ]; do
  if nc -z db 5432; then
    echo "Database is ready!"
    break
  fi
  
  echo "Attempt $attempt/$max_attempts: Database not ready yet..."
  sleep 2
  attempt=$((attempt + 1))
done

if [ $attempt -gt $max_attempts ]; then
  echo "Error: Database did not become ready in time"
  exit 1
fi

# Push database schema (creates tables if they don't exist)
echo "Pushing database schema..."
DATABASE_URL="postgresql://docker:BradescoPOC@db:5432/bradesco?schema=public" npm run prisma:db:push

# Run seed
echo "Running database seed..."
DATABASE_URL="postgresql://docker:BradescoPOC@db:5432/bradesco?schema=public" npm run seed:prod

# Start the application
echo "Starting application..."
exec npm run start 