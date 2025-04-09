import "./App.css";
import GuessWordGraph from "./components/GuessWordGraph";
import Footer from "./components/Footer";
import CountdownTimer from "./components/CountdownTimer";
import { RefreshTriggerProvider } from "./context/RefreshTriggerContext";
import { LeaderboardProvider } from "./context/LeaderboardContext";
import { SelectedPointProvider } from "./context/SelectedPointContext";

function App() {
  return (
    <RefreshTriggerProvider>
      <LeaderboardProvider>
        <SelectedPointProvider>
          <div className="app-container">
            <CountdownTimer />
            <GuessWordGraph />
            <Footer />
          </div>
        </SelectedPointProvider>
      </LeaderboardProvider>
    </RefreshTriggerProvider>
  );
}

export default App;
