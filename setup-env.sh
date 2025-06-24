#!/bin/bash

# Setup script for AICC Bradesco environment configuration
# This script helps you set up your .env file for different environments

set -e

echo "🚀 AICC Bradesco Environment Setup"
echo "=================================="

# Function to create .env file
create_env_file() {
    local env_type=$1
    
    echo "Creating .env file for $env_type environment..."
    
    if [ "$env_type" = "dev" ]; then
        cat > .env << EOF
# Environment variables for AICC Bradesco
# These variables are validated by src/env/index.ts

# Node environment
NODE_ENV=dev

# Server port
PORT=3333

# Debug mode for enhanced logging
DEBUG_MODE=false

# Database configuration
# Use 'localhost' for local development
DATABASE_URL=postgresql://docker:BradescoPOC@localhost:5432/bradesco?schema=public
POSTGRES_USER=docker
POSTGRES_PASSWORD=BradescoPOC
POSTGRES_DATABASE=bradesco
EOF
    elif [ "$env_type" = "production" ]; then
        cat > .env << EOF
# Environment variables for AICC Bradesco
# These variables are validated by src/env/index.ts

# Node environment
NODE_ENV=production

# Server port
PORT=3333

# Debug mode for enhanced logging
DEBUG_MODE=false

# Database configuration
# Use 'db' for Docker Compose networking
DATABASE_URL=postgresql://docker:BradescoPOC@db:5432/bradesco?schema=public
POSTGRES_USER=docker
POSTGRES_PASSWORD=BradescoPOC
POSTGRES_DATABASE=bradesco
EOF
    fi
    
    echo "✅ .env file created for $env_type environment"
}

# Function to setup development environment
setup_dev() {
    echo "🔧 Setting up development environment..."
    
    create_env_file "dev"
    
    echo ""
    echo "📋 Next steps for development:"
    echo "1. Start the database: docker-compose up db"
    echo "2. Run migrations: npm run prisma:migrate"
    echo "3. Run seed: npm run seed"
    echo "4. Start the app: npm run dev"
    echo ""
}

# Function to setup production environment
setup_production() {
    echo "🚀 Setting up production environment..."
    
    create_env_file "production"
    
    echo ""
    echo "📋 Next steps for production:"
    echo "1. Run: docker-compose up --build"
    echo "2. The app will automatically run migrations and seed data"
    echo ""
}

# Function to show current environment
show_current() {
    if [ -f .env ]; then
        echo "📄 Current .env configuration:"
        echo "--------------------------------"
        cat .env
        echo "--------------------------------"
    else
        echo "❌ No .env file found"
    fi
}

# Main script logic
case "${1:-}" in
    "dev")
        setup_dev
        ;;
    "production"|"prod")
        setup_production
        ;;
    "show"|"current")
        show_current
        ;;
    *)
        echo "Usage: $0 {dev|production|show}"
        echo ""
        echo "Commands:"
        echo "  dev        - Setup development environment (localhost database)"
        echo "  production - Setup production environment (Docker database)"
        echo "  show       - Show current .env configuration"
        echo ""
        echo "Examples:"
        echo "  $0 dev        # Setup for local development"
        echo "  $0 production # Setup for Docker production"
        echo "  $0 show       # Show current configuration"
        exit 1
        ;;
esac 