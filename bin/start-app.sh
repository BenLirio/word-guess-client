#!/bin/bash

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}Starting application...${NC}"

echo -e "${GREEN}Installing dependencies...${NC}"
npm install

echo -e "${GREEN}Starting development server...${NC}"
npm run dev
