#!/bin/bash

# ============================================================
# Provider Bridge — Startup Script
# Launches the server with environment validation
# ============================================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Paths
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_DIR="$( cd "${SCRIPT_DIR}/.." && pwd )"
ENV_FILE="${PROJECT_DIR}/.env"

# Configuration
PORT="${PORT:-25809}"
MODE="${1:-dev}"
ALLOW_REMOTE="${2:---}"

# ============================================================
# Functions
# ============================================================

print_banner() {
  echo -e "${BLUE}"
  echo "═══════════════════════════════════════════════════════════════════"
  echo "  🌉 Provider Bridge Endpoint — Startup Script"
  echo "═══════════════════════════════════════════════════════════════════"
  echo -e "${NC}"
}

check_env() {
  echo -e "${YELLOW}📋 Checking environment...${NC}"

  if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}✗ ERROR: .env file not found${NC}"
    echo "  Please run: cp .env.example .env"
    exit 1
  fi

  # Load .env
  export $(cat "$ENV_FILE" | grep -v '#' | xargs)

  # Check critical variables
  local missing_vars=0

  if [ -z "$DATABASE_URL" ] && [ -z "$DATABASE_TYPE" ]; then
    echo -e "${RED}✗ DATABASE_URL or DATABASE_TYPE not set${NC}"
    missing_vars=1
  else
    echo -e "${GREEN}✓ Database configured${NC}"
  fi

  # Check API keys
  local key_count=$(grep -c "GEMINI_API_KEY_" "$ENV_FILE" 2>/dev/null || echo 0)
  if [ "$key_count" -lt 1 ]; then
    echo -e "${YELLOW}⚠ WARNING: No GEMINI_API_KEY_* found in .env${NC}"
    echo "  Add keys: GEMINI_API_KEY_1=..., GEMINI_API_KEY_2=... etc."
  else
    # Count actual keys with values
    local valid_keys=$(grep "GEMINI_API_KEY_.*=AIza" "$ENV_FILE" 2>/dev/null | wc -l)
    echo -e "${GREEN}✓ API Keys: ${valid_keys}/40${NC}"

    if [ "$valid_keys" -lt 1 ]; then
      echo -e "${YELLOW}⚠ WARNING: API keys not configured with actual values${NC}"
    fi
  fi

  if [ -z "$JWT_SECRET" ]; then
    echo -e "${RED}✗ JWT_SECRET not configured${NC}"
    missing_vars=1
  else
    echo -e "${GREEN}✓ JWT_SECRET configured${NC}"
  fi

  if [ "$missing_vars" -eq 1 ]; then
    echo -e "${RED}Cannot proceed with missing variables${NC}"
    exit 1
  fi

  echo -e "${GREEN}✓ Environment validation passed${NC}\n"
}

check_node() {
  echo -e "${YELLOW}📦 Checking Node.js...${NC}"

  if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found${NC}"
    echo "  Please install Node.js 22+"
    exit 1
  fi

  NODE_VERSION=$(node -v)
  echo -e "${GREEN}✓ Node.js ${NODE_VERSION}${NC}"

  if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
  fi

  NPM_VERSION=$(npm -v)
  echo -e "${GREEN}✓ npm ${NPM_VERSION}${NC}\n"
}

check_dependencies() {
  echo -e "${YELLOW}📚 Checking dependencies...${NC}"

  if [ ! -d "$PROJECT_DIR/node_modules" ]; then
    echo -e "${YELLOW}Installing npm packages...${NC}"
    cd "$PROJECT_DIR"
    npm install
  fi

  echo -e "${GREEN}✓ Dependencies ready${NC}\n"
}

check_build() {
  if [ "$MODE" != "dev" ]; then
    echo -e "${YELLOW}🔨 Checking TypeScript build...${NC}"

    if [ ! -d "$PROJECT_DIR/dist" ]; then
      echo -e "${YELLOW}Building project...${NC}"
      cd "$PROJECT_DIR"
      npm run build
    fi

    echo -e "${GREEN}✓ Build ready${NC}\n"
  fi
}

check_port() {
  echo -e "${YELLOW}🔍 Checking port ${PORT}...${NC}"

  # Check if port is in use
  if command -v lsof &> /dev/null; then
    if lsof -Pi :${PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
      echo -e "${RED}✗ Port ${PORT} is already in use${NC}"
      echo "  Kill with: lsof -ti:${PORT} | xargs kill -9"
      exit 1
    fi
  fi

  echo -e "${GREEN}✓ Port ${PORT} is available${NC}\n"
}

print_startup_info() {
  echo -e "${GREEN}"
  echo "═══════════════════════════════════════════════════════════════════"
  echo "  ✨ Provider Bridge is Starting..."
  echo "═══════════════════════════════════════════════════════════════════"
  echo -e "${NC}"

  echo -e "${BLUE}Server Information:${NC}"
  echo "  🌐 URL:      http://localhost:${PORT}"
  echo "  📚 Docs:     http://localhost:${PORT}/docs"
  echo "  🎛️  Admin:    http://localhost:${PORT}/admin"
  echo "  🏥 Health:   http://localhost:${PORT}/health"
  echo ""

  if [ "$ALLOW_REMOTE" == "--remote" ]; then
    echo -e "${BLUE}Remote Access Enabled:${NC}"
    # Get local IP
    if command -v ifconfig &> /dev/null; then
      LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1)
      if [ -n "$LOCAL_IP" ]; then
        echo "  🌐 LAN:      http://${LOCAL_IP}:${PORT}"
      fi
    fi
    echo ""
  fi

  echo -e "${BLUE}API Endpoints:${NC}"
  echo "  POST  /api/providers/gemini_api_key_rotative/chat"
  echo "  GET   /api/providers/gemini_api_key_rotative/stats"
  echo "  POST  /v1/chat/completions (OpenAI compatible)"
  echo "  GET   /v1/models"
  echo ""

  echo -e "${YELLOW}Mode: ${MODE}${NC}"
  echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
  echo ""
  echo "═══════════════════════════════════════════════════════════════════"
  echo ""
}

# ============================================================
# Main
# ============================================================

print_banner
check_node
check_env
check_dependencies
check_port
check_build
print_startup_info

# Launch server
cd "$PROJECT_DIR"

if [ "$MODE" = "dev" ]; then
  echo -e "${YELLOW}Starting in development mode (with hot-reload)...${NC}\n"
  npm run dev
elif [ "$MODE" = "prod" ]; then
  echo -e "${YELLOW}Starting in production mode...${NC}\n"
  npm run build
  npm start
elif [ "$MODE" = "remote" ]; then
  echo -e "${YELLOW}Starting in remote access mode...${NC}\n"
  npm start -- --remote
else
  echo -e "${RED}Unknown mode: $MODE${NC}"
  echo "Usage: ./scripts/start.sh [dev|prod|remote]"
  exit 1
fi
