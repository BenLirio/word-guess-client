import "./App.css";
import GuessWordGraph from "./components/GuessWordGraph";
import Footer from "./components/Footer";
import CountdownTimer from "./components/CountdownTimer";
import { RefreshTriggerProvider } from "./context/RefreshTriggerContext";

function App() {
  return (
    <RefreshTriggerProvider>
      <div className="app-container">
        <CountdownTimer />
        <GuessWordGraph />
        <Footer />
      </div>
    </RefreshTriggerProvider>
  );
}

export default App;
