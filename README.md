# word-guess-client

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

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm run dev
```

### Build for Production

```bash
# Build the app
npm run build
```

### Preview Production Build

```bash
# Preview the build
npm run preview
```

## Deployment

This project is configured for automatic deployment to GitHub Pages through GitHub Actions. Just push to the main branch and your site will be deployed.

## Project Structure

```
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
```

## License

[MIT](LICENSE)
