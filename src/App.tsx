import "./App.css";
import GuessWordGraph from "./components/GuessWordGraph";
import Footer from "./components/Footer";
import CountdownTimer from "./components/CountdownTimer";

function App() {
  return (
    <div className="app-container">
      <CountdownTimer />
      <GuessWordGraph />
      <Footer />
    </div>
  );
}

export default App;
