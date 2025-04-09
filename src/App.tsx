import "./App.css";
import GuessWordGraph from "./components/GuessWordGraph";
import Footer from "./components/Footer";
import CountdownTimer from "./components/CountdownTimer";
import { RefreshTriggerProvider } from "./context/RefreshTriggerContext";
import { LeaderboardProvider } from "./context/LeaderboardContext";

function App() {
  return (
    <RefreshTriggerProvider>
      <LeaderboardProvider>
        <div className="app-container">
          <CountdownTimer />
          <GuessWordGraph />
          <Footer />
        </div>
      </LeaderboardProvider>
    </RefreshTriggerProvider>
  );
}

export default App;
