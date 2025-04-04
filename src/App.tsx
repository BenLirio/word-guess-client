import "./App.css";
import GuessWordGraph from "./components/GuessWordGraph"; // Import the graph component

function App() {
  return (
    <div className="app-container">
      <GuessWordGraph /> {/* Render the graph component */}
      <footer className="footer">
        <p>
          Winners posted to our{" "}
          <a
            href="https://discord.gg/byVdbGEk"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            Discord
          </a>{" "}
          community!
        </p>
      </footer>
    </div>
  );
}

export default App;
