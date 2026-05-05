#!/bin/bash

GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_status() { echo -e "${GREEN}[STOP-DEV]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

if [ ! -d "client" ] || [ ! -d "server" ]; then
    print_error "Run this script from the ecommerce-platform root directory."
    exit 1
fi

# Pick docker-compose command (v2 plugin vs legacy)
if docker compose version &> /dev/null; then
    DC="docker compose"
elif command -v docker-compose &> /dev/null; then
    DC="docker-compose"
else
    print_error "docker compose is not available."
    exit 1
fi

# Kill anything still listening on our app ports
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ -n "$pid" ]; then
        print_status "Killing process on port $port (PID: $pid)..."
        kill -9 $pid 2>/dev/null
    fi
}

kill_port 5000
kill_port 3000

# Stop docker containers
print_status "Stopping Docker containers..."
$DC -f server/docker-compose.dev.yml down

print_status "All services stopped."
print_warning "Volumes preserved. To wipe DB data: $DC -f server/docker-compose.dev.yml down -v"
