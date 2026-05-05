#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[START-DEV]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to cleanup background processes on exit
cleanup() {
    print_status "Shutting down all services..."

    # Kill all child processes
    pkill -P $$

    # Note: Docker containers keep running in background
    # Use stop-dev.sh to stop them if needed

    print_status "All services stopped."
    print_warning "Docker containers (MongoDB) are still running."
    print_warning "Run ./stop-dev.sh to stop them."
    exit 0
}

# Trap Ctrl+C and cleanup
trap cleanup INT TERM

# Check if required directories exist
if [ ! -d "client" ] || [ ! -d "server" ]; then
    print_error "Missing project directories. Please run this script from the ecommerce-platform root directory."
    exit 1
fi

print_status "Starting ShopKit Development Environment..."
echo ""

# Check if Docker is available (required)
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    print_status "Download from: https://docs.docker.com/get-docker/"
    exit 1
fi

# Pick docker-compose command (v2 plugin vs legacy)
if docker compose version &> /dev/null; then
    DC="docker compose"
elif command -v docker-compose &> /dev/null; then
    DC="docker-compose"
else
    print_error "docker compose is not available. Install Docker Desktop or the compose plugin."
    exit 1
fi

# Start Docker if not running
if ! docker info &> /dev/null; then
    print_warning "Docker is not running. Starting Docker Desktop..."

    # Start Docker Desktop on macOS
    open -a Docker 2>/dev/null

    if [ $? -ne 0 ]; then
        print_error "Failed to start Docker. Please start it manually."
        exit 1
    fi

    # Wait for Docker to be ready
    print_status "Waiting for Docker to start (this may take 30-60 seconds)..."
    DOCKER_RETRIES=60
    while [ $DOCKER_RETRIES -gt 0 ]; do
        if docker info &> /dev/null; then
            print_status "Docker is ready."
            break
        fi
        DOCKER_RETRIES=$((DOCKER_RETRIES-1))
        sleep 1
    done

    if [ $DOCKER_RETRIES -eq 0 ]; then
        print_error "Docker failed to start within timeout. Please start it manually."
        exit 1
    fi
else
    print_status "Docker is already running."
fi

# Start Docker services (MongoDB)
echo ""
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}[DOCKER]${NC} Starting MongoDB container..."
echo -e "${BLUE}════════════════════════════════════════════════════════════════${NC}"

$DC -f server/docker-compose.dev.yml up -d mongo 2>&1

if [ $? -ne 0 ]; then
    print_error "Failed to start Docker containers."
    exit 1
fi

# Wait for MongoDB to be healthy
print_status "Waiting for MongoDB to be ready..."
RETRIES=30
while [ $RETRIES -gt 0 ]; do
    if $DC -f server/docker-compose.dev.yml exec -T mongo mongosh --quiet --eval "db.adminCommand('ping').ok" 2>/dev/null | grep -q 1; then
        print_status "MongoDB is ready."
        break
    fi
    RETRIES=$((RETRIES-1))
    sleep 1
done

if [ $RETRIES -eq 0 ]; then
    print_error "MongoDB failed to start within timeout."
    exit 1
fi

echo ""
echo -e "${BLUE}[DOCKER]${NC} MongoDB: mongodb://localhost:27017/shopkit"

echo ""
print_status "Installing dependencies..."
echo ""

# Install backend dependencies
echo -e "${CYAN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}[BACKEND]${NC} Installing dependencies..."
echo -e "${CYAN}════════════════════════════════════════════════════════════════${NC}"
(cd server && npm install)
if [ $? -ne 0 ]; then
    print_error "Failed to install backend dependencies"
    exit 1
fi
print_status "Backend dependencies installed."

# Install frontend dependencies
echo -e "${MAGENTA}════════════════════════════════════════════════════════════════${NC}"
echo -e "${MAGENTA}[FRONTEND]${NC} Installing dependencies..."
echo -e "${MAGENTA}════════════════════════════════════════════════════════════════${NC}"
(cd client && npm install)
if [ $? -ne 0 ]; then
    print_error "Failed to install frontend dependencies"
    exit 1
fi
print_status "Frontend dependencies installed."

# Seed database (idempotent — admin, categories, sample products)
echo ""
echo -e "${CYAN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}[BACKEND]${NC} Seeding database..."
echo -e "${CYAN}════════════════════════════════════════════════════════════════${NC}"
(cd server && npm run seed)
if [ $? -ne 0 ]; then
    print_warning "Seeding failed (non-fatal). You can rerun with: cd server && npm run seed"
else
    print_status "Database seeded."
fi

echo ""
print_status "Checking for existing processes on required ports..."
echo ""

# Kill any existing processes on the required ports
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port 2>/dev/null)
    if [ -n "$pid" ]; then
        print_warning "Port $port is in use (PID: $pid). Killing process..."
        kill -9 $pid 2>/dev/null
        sleep 1
        print_status "Port $port is now free."
    else
        print_status "Port $port is available."
    fi
}

kill_port 5000
kill_port 3000

echo ""
print_status "Starting services..."
echo ""

# Function to run a service with colored prefix
run_service() {
    local name=$1
    local color=$2
    local dir=$3
    local cmd=$4

    echo -e "${color}════════════════════════════════════════════════════════════════${NC}"
    echo -e "${color}[${name}]${NC} Starting in ${dir}..."
    echo -e "${color}[${name}]${NC} Command: ${cmd}"
    echo -e "${color}════════════════════════════════════════════════════════════════${NC}"

    # Run the service and prefix each line with colored service name
    (cd "$dir" && eval "$cmd" 2>&1 | while IFS= read -r line; do
        echo -e "${color}[${name}]${NC} ${line}"
    done) &
}

# Start Backend
run_service "BACKEND" "$CYAN" "server" "npm run dev"

# Give backend a moment to start
sleep 3

# Start Frontend
run_service "FRONTEND" "$MAGENTA" "client" "npm run dev"

# Give frontend a moment to start
sleep 2

echo ""
print_status "All services started!"
echo ""
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}Development Environment Ready!${NC}"
echo ""
echo -e "${CYAN}Backend:${NC}   http://localhost:5000"
echo -e "${MAGENTA}Frontend:${NC}  http://localhost:3000"
echo -e "${BLUE}Database:${NC}  mongodb://localhost:27017/shopkit"
echo ""
echo -e "${YELLOW}Admin login:${NC} admin@shopkit.ba / Admin123!"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop Node.js services${NC}"
echo -e "${YELLOW}Docker containers will keep running (use ./stop-dev.sh to stop all)${NC}"
echo -e "${GREEN}════════════════════════════════════════════════════════════════${NC}"
echo ""

# Wait for all background processes
wait
