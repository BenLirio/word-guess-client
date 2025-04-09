/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import { guessWord } from "../api"; // Import the API function
import GraphCanvas from "./GraphCanvas"; // Import the new GraphCanvas component
import "./GuessWordGraph.css"; // Import the CSS file
import { GuessWordResponse } from "../types";
import { useRefreshTriggerContext } from "../context/RefreshTriggerContext";
import { useSelectedPoint } from "../context/SelectedPointContext";

const GuessWordGraph: React.FC = () => {
  const { refreshTrigger } = useRefreshTriggerContext();
  const [dataPoints, setDataPoints] = useState<GuessWordResponse[]>([]);
  const [word, setWord] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setSelectedPoint } = useSelectedPoint();

  useEffect(() => {
    // Reset the data points when the refresh trigger changes
    setDataPoints([]);
  }, [refreshTrigger]);

  const handleGuess = async () => {
    if (!word) {
      setError("Please enter a word to guess.");
      return;
    }

    setError(null); // Clear any previous error
    setIsLoading(true); // Disable the button while the request is in progress

    try {
      const response = await guessWord({ word });
      setWord(""); // Clear the input field after submission
      setDataPoints((prev) => [...prev, response]);
      setSelectedPoint({
        x: response.x,
        y: response.y,
        word: response.word,
      });
    } catch (error) {
      console.error("Error calling the API:", error);
      setError("Failed to fetch data from the API. Please try again.");
    } finally {
      setIsLoading(false); // Re-enable the button after the request is complete
    }
  };

  return (
    <div className="container">
      <h2>Guess Word Graph</h2>
      <p>
        <em>
          Guess a word and see how an AI ranks it on two dimensions—your mission
          is to land it inside the red square. Good luck!
        </em>
      </p>
      <div className="input-container">
        <input
          type="text"
          value={word}
          onChange={(e) => setWord(e.target.value)}
          placeholder="Enter a word"
          disabled={isLoading} // Disable input while loading
        />
      </div>
      <div className="button-container">
        <button onClick={handleGuess} disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit Guess"}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="graph-container">
        <GraphCanvas dataPoints={dataPoints} />
      </div>
    </div>
  );
};

export default GuessWordGraph;
