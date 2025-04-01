#!/bin/bash

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Parse command line arguments
PLATFORM=""

usage() {
  echo "Usage: $0 -p <platform>"
  echo "Platforms: github, netlify, vercel, firebase"
  exit 1
}

while getopts ":p:" opt; do
  case ${opt} in
    p )
      PLATFORM=$OPTARG
      ;;
    \? )
      echo -e "${RED}Invalid option: $OPTARG${NC}" 1>&2
      usage
      ;;
    : )
      echo -e "${RED}Invalid option: $OPTARG requires an argument${NC}" 1>&2
      usage
      ;;
  esac
done

if [ -z "$PLATFORM" ]; then
  echo -e "${RED}Error: Platform is required${NC}"
  usage
fi

# Build the application
echo -e "${BLUE}Building application...${NC}"
npm run build

# Deploy based on platform
case $PLATFORM in
  github)
    echo -e "${GREEN}Deploying to GitHub Pages...${NC}"
    echo -e "${YELLOW}Note: Make sure you have set up GitHub Pages in your repository settings.${NC}"
    echo -e "${YELLOW}GitHub Actions will handle the deployment on push to main.${NC}"
    ;;
  netlify)
    echo -e "${GREEN}Deploying to Netlify...${NC}"
    if ! command -v netlify &> /dev/null; then
      echo -e "${YELLOW}Installing Netlify CLI...${NC}"
      npm install -g netlify-cli
    fi
    netlify deploy --prod
    ;;
  vercel)
    echo -e "${GREEN}Deploying to Vercel...${NC}"
    if ! command -v vercel &> /dev/null; then
      echo -e "${YELLOW}Installing Vercel CLI...${NC}"
      npm install -g vercel
    fi
    vercel --prod
    ;;
  firebase)
    echo -e "${GREEN}Deploying to Firebase Hosting...${NC}"
    if ! command -v firebase &> /dev/null; then
      echo -e "${YELLOW}Installing Firebase CLI...${NC}"
      npm install -g firebase-tools
    fi
    
    # Check if firebase.json exists
    if [ ! -f "firebase.json" ]; then
      echo -e "${YELLOW}Initializing Firebase...${NC}"
      firebase init hosting
    fi
    
    firebase deploy --only hosting
    ;;
  *)
    echo -e "${RED}Unsupported platform: $PLATFORM${NC}"
    usage
    ;;
esac

echo -e "${GREEN}Deployment process completed!${NC}"
