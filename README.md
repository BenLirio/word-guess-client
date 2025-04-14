# Word Guess Client

The **Word Guess Client** is a React-based web application where users guess words and see how an AI ranks them on two dimensions. The goal is to land guesses inside a red square on a graph. The app features real-time updates, a leaderboard, and a retro-inspired design.

## Features

- **Interactive Graph**: Visualize guesses and their positions on a graph.
- **Leaderboard**: View other players' guesses and rankings.
- **Countdown Timer**: Displays time until the next graph update.
- **Win Modal**: Celebrate wins and save them to the leaderboard.
- **Responsive Design**: Optimized for various screen sizes.
- **Retro Theme**: Styled with a retro pixelated aesthetic.

## Technologies Used

- **React**: Frontend framework.
- **TypeScript**: Type-safe development.
- **Vite**: Fast development server and build tool.
- **Chart.js**: For rendering charts.
- **Axios**: For API requests.
- **CSS**: Custom styles with retro-inspired design.

## Getting Started

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/BenLirio/word-guess-client.git
   cd word-guess-client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at [http://localhost:5173](http://localhost:5173).

### Build

To create a production build:
```bash
npm run build
```

The build output will be in the `dist` directory.

### Deployment

The app is configured to deploy to GitHub Pages. To deploy:
```bash
npm run deploy
```

### Linting

Run ESLint to check for code issues:
```bash
npm run lint
```

## Project Structure

```
word-guess-client/
├── src/
│   ├── api/                # API request functions
│   ├── components/         # React components
│   ├── context/            # React context providers
│   ├── types/              # TypeScript type definitions
│   ├── App.tsx             # Main application component
│   ├── main.tsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── package.json            # Project metadata and dependencies
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Project documentation
```

## Key Components

### `GuessWordGraph`

- Allows users to input guesses and displays them on a graph.
- Highlights guesses with green (user) and yellow (others).

### `GraphCanvas`

- Renders the graph with axes, labels, and data points.
- Handles user interactions like selecting points.

### `WinModal`

- Displays a modal when a user wins.
- Allows saving the win to the leaderboard.

### `Leaderboard`

- Fetches and displays leaderboard data.
- Updates dynamically every 5 seconds.

### `CountdownTimer`

- Shows the time remaining until the next graph update.

## API Endpoints

The app communicates with a backend API for various functionalities:

- **`guessWord`**: Submit a word guess.
- **`getSpectrum`**: Fetch axis labels for the graph.
- **`getTarget`**: Fetch the target area on the graph.
- **`postWin`**: Save a win to the leaderboard.
- **`getLeaderboard`**: Fetch leaderboard data.
- **`listWins`**: Fetch a list of all wins.

## Environment Variables

The API URL is determined based on the environment:

- Development: `http://localhost:3000/dev/app`
- Production: `https://yj0xqkim6g.execute-api.us-east-1.amazonaws.com/dev/app`

## Deployment

The app is deployed to GitHub Pages. The `CNAME` file specifies the custom domain: `word-guess.com`.

## Contributing

Contributions are welcome! To contribute:

1. Fork the repository.
2. Create a new branch:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to your branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.

## License

This project is licensed under the MIT License.

## Contact

For bug reports or feature requests, join our [Discord community](https://discord.gg/byVdbGEk).
