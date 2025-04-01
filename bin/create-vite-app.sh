#!/bin/bash

set -e

# Colors for terminal output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Print stylized messages
info() {
  echo -e "${BLUE}INFO:${NC} $1"
}

success() {
  echo -e "${GREEN}SUCCESS:${NC} $1"
}

warn() {
  echo -e "${YELLOW}WARNING:${NC} $1"
}

error() {
  echo -e "${RED}ERROR:${NC} $1"
  exit 1
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
  error "Node.js is not installed. Please install Node.js before running this script."
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
  error "npm is not installed. Please install npm before running this script."
fi

# Get project name from current directory
PROJECT_NAME=$(basename "$PWD")
info "Setting up Vite React project: $PROJECT_NAME"

# Initialize a new Vite app with React template
info "Creating new Vite React app..."
npm create vite@latest . -- --template react

# Install dependencies
info "Installing dependencies..."
npm install

# Install additional packages for deployment, routing, state management
info "Installing additional packages..."
npm install react-router-dom@6 \
  @vitejs/plugin-react \
  axios \
  zustand \
  @mantine/hooks

# Install and set up Tailwind CSS with correct dependencies
info "Installing and setting up Tailwind CSS with correct dependencies..."
npm install -D tailwindcss@latest postcss@latest autoprefixer@latest @tailwindcss/postcss

# Create Tailwind config files manually instead of using the CLI
info "Creating Tailwind configuration files manually..."

# Create Tailwind config manually
info "Creating tailwind.config.js..."
cat > tailwind.config.js << 'EOL'
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
EOL

# Create PostCSS config manually
info "Creating postcss.config.js..."
cat > postcss.config.js << 'EOL'
export default {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}
EOL

# Add Tailwind directives to CSS
cat > src/index.css << 'EOL'
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;
}

body {
  margin: 0;
  min-height: 100vh;
}
EOL

# Update vite.config.js for deployment
cat > vite.config.js << 'EOL'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Base path for deployment - change if needed for your hosting platform
  base: './',
  server: {
    // Development server settings
    port: 3000,
    open: true
  },
  build: {
    // Production build settings
    outDir: 'dist',
    minify: 'terser',
    sourcemap: false,
    // You can add environment-specific settings here
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
})
EOL

# Create a basic project structure
info "Creating project structure..."

# Create directories
mkdir -p src/components
mkdir -p src/pages
mkdir -p src/assets
mkdir -p src/hooks
mkdir -p src/store
mkdir -p src/utils
mkdir -p src/api

# Create a basic Router setup
cat > src/App.jsx << 'EOL'
import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import './App.css'
import Home from './pages/Home'
import About from './pages/About'

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-md p-4">
          <div className="container mx-auto flex justify-between">
            <Link to="/" className="font-bold text-xl text-blue-600">
              My Vite App
            </Link>
            <div className="space-x-4">
              <Link to="/" className="text-gray-600 hover:text-blue-600">
                Home
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600">
                About
              </Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <footer className="bg-white shadow-inner p-4 mt-8">
          <div className="container mx-auto text-center text-gray-500">
            © {new Date().getFullYear()} My Vite App. All rights reserved.
          </div>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
EOL

# Update App.css
cat > src/App.css << 'EOL'
#root {
  width: 100%;
  margin: 0 auto;
  text-align: center;
}
EOL

# Create sample pages
cat > src/pages/Home.jsx << 'EOL'
import { useState } from 'react'

function Home() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <h1 className="text-4xl font-bold mb-8">Vite + React</h1>
      <div className="p-8 bg-white rounded-lg shadow-md">
        <button
          onClick={() => setCount((count) => count + 1)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          count is {count}
        </button>
        <p className="mt-4">
          Edit <code className="bg-gray-100 p-1 rounded">src/pages/Home.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="text-sm text-gray-500 mt-8">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default Home
EOL

cat > src/pages/About.jsx << 'EOL'
function About() {
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">About This Project</h1>
      <p className="mb-4">
        This is a starter Vite React project with routing and deployment configuration set up.
        It includes:
      </p>
      <ul className="list-disc ml-6 mb-6 space-y-2">
        <li>React Router for navigation</li>
        <li>Tailwind CSS for styling</li>
        <li>Optimized Vite configuration</li>
        <li>Project structure for scaling</li>
      </ul>
      <p>
        Feel free to customize and extend this template to build your amazing application!
      </p>
    </div>
  )
}

export default About
EOL

# Create a simple store with Zustand
cat > src/store/useStore.js << 'EOL'
import { create } from 'zustand'

const useStore = create((set) => ({
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))

export default useStore
EOL

# Create a custom hook example
cat > src/hooks/useFetch.js << 'EOL'
import { useState, useEffect } from 'react'
import axios from 'axios'

function useFetch(url) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(url)
        setData(response.data)
        setError(null)
      } catch (err) {
        setError(err.message || 'Something went wrong')
        setData(null)
      } finally {
        setLoading(false)
      }
    }

    if (url) {
      fetchData()
    }

    return () => {
      // Cleanup if needed
    }
  }, [url])

  return { data, loading, error }
}

export default useFetch
EOL

# Create a sample API service
cat > src/api/apiService.js << 'EOL'
import axios from 'axios'

// Create an axios instance with default config
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://api.example.com',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors (like 401) here
    if (error.response && error.response.status === 401) {
      // Handle unauthorized
      console.log('Unauthorized, redirecting to login...')
      // Add your redirect logic here
    }
    return Promise.reject(error)
  }
)

// Example endpoints
export const exampleApi = {
  getData: () => api.get('/data'),
  postData: (data) => api.post('/data', data),
  updateData: (id, data) => api.put(`/data/${id}`, data),
  deleteData: (id) => api.delete(`/data/${id}`),
}

export default api
EOL

# Create utility functions
cat > src/utils/helpers.js << 'EOL'
/**
 * Format a date string
 * @param {string|Date} date - The date to format
 * @param {string} locale - Locale string (default: 'en-US')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, locale = 'en-US') => {
  const dateObj = date instanceof Date ? date : new Date(date)
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(dateObj)
}

/**
 * Truncate a string to a specific length
 * @param {string} str - The string to truncate
 * @param {number} length - Maximum length
 * @returns {string} Truncated string
 */
export const truncate = (str, length = 100) => {
  if (!str || str.length <= length) return str
  return `${str.slice(0, length)}...`
}

/**
 * Debounce a function call
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
EOL

# Create deployment files
info "Setting up deployment configuration..."

# Create GitHub Actions workflow for GitHub Pages
mkdir -p .github/workflows
cat > .github/workflows/deploy.yml << 'EOL'
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
        
      - name: Setup Pages
        uses: actions/configure-pages@v3
        
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v1
        with:
          path: ./dist

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v1
EOL

# Create sample environment files
cat > .env.sample << 'EOL'
# API Configuration
VITE_API_URL=https://api.example.com
VITE_API_KEY=your_api_key_here

# App Configuration
VITE_APP_NAME=My Vite App
VITE_APP_VERSION=0.1.0
EOL

cat > .env.development << 'EOL'
# Development settings
VITE_API_URL=http://localhost:8000
VITE_DEBUG=true
EOL

cat > .env.production << 'EOL'
# Production settings
VITE_API_URL=https://api.example.com
VITE_DEBUG=false
EOL

# Update .gitignore
cat > .gitignore << 'EOL'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment files
.env
.env.local
.env.*.local

# Production build
/build
EOL

# Create a README.md file
cat > README.md << EOL
# $PROJECT_NAME

A modern React application built with Vite.

## Features

- ⚡️ Lightning fast development with Vite
- 🚀 React with hooks
- 🧭 React Router for routing
- 💅 Tailwind CSS for styling
- 🔄 State management with Zustand
- 📡 Axios for API requests
- 📦 GitHub Actions for deployment

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

\`\`\`bash
# Install dependencies
npm install
\`\`\`

### Development

\`\`\`bash
# Start development server
npm run dev
\`\`\`

### Build for Production

\`\`\`bash
# Build the app
npm run build
\`\`\`

### Preview Production Build

\`\`\`bash
# Preview the build
npm run preview
\`\`\`

## Deployment

This project is configured for automatic deployment to GitHub Pages through GitHub Actions. Just push to the main branch and your site will be deployed.

## Project Structure

\`\`\`
/
├── public/              # Static assets
├── src/
│   ├── api/             # API services
│   ├── assets/          # Imported assets
│   ├── components/      # Reusable components
│   ├── hooks/           # Custom React hooks
│   ├── pages/           # Page components
│   ├── store/           # State management
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main App component
│   ├── main.jsx         # Application entry
│   └── index.css        # Global styles
├── .env.development     # Development environment variables
├── .env.production      # Production environment variables
├── vite.config.js       # Vite configuration
└── tailwind.config.js   # Tailwind CSS configuration
\`\`\`

## License

[MIT](LICENSE)
EOL

# Create a setup script for running the app
cat > bin/start-app.sh << 'EOL'
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
EOL

# Make the script executable
chmod +x bin/start-app.sh

# Update package.json with additional scripts
jq '.scripts += {"lint": "eslint src --ext js,jsx --report-unused-disable-directives --max-warnings 0", "format": "prettier --write \"./**/*.{js,jsx,json,css}\"", "test": "vitest run", "test:watch": "vitest"}' package.json > package.json.tmp
mv package.json.tmp package.json

# Add deployment script for different platforms
cat > bin/deploy.sh << 'EOL'
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
EOL

# Make the deployment script executable
chmod +x bin/deploy.sh

success "✨ Setup complete! Your Vite React app is ready to go!"
echo ""
echo -e "${GREEN}Next steps:${NC}"
echo -e "1. Review the project structure"
echo -e "2. Start the development server: ${BLUE}npm run dev${NC}"
echo -e "3. Build for production: ${BLUE}npm run build${NC}"
echo -e "4. Deploy using: ${BLUE}./bin/deploy.sh -p github${NC} (or netlify, vercel, firebase)"
echo ""
echo -e "${YELLOW}Happy coding!${NC}"