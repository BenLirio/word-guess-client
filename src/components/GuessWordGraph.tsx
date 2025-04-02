/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { guessWord } from "../api"; // Import the API function
import GraphCanvas from "./GraphCanvas"; // Import the new GraphCanvas component

const GuessWordGraph: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<{ x: number; y: number }[]>([]);
  const [word, setWord] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGuess = async () => {
    if (!word) {
      setError("Please enter a word to guess.");
      return;
    }

    setError(null); // Clear any previous error
    setIsLoading(true); // Disable the button while the request is in progress

    try {
      const response = await guessWord({ word });
      setDataPoints((prev) => [...prev, { x: response.x, y: response.y }]);
    } catch (error) {
      console.error("Error calling the API:", error);
      setError("Failed to fetch data from the API. Please try again.");
    } finally {
      setIsLoading(false); // Re-enable the button after the request is complete
    }
  };

  return (
    <div>
      <h2>Guess Word Graph</h2>
      <input
        type="text"
        value={word}
        onChange={(e) => setWord(e.target.value)}
        placeholder="Enter a word"
      />
      <button onClick={handleGuess} disabled={isLoading}>
        {isLoading ? "Submitting..." : "Submit Guess"}
      </button>
      {error && <p>{error}</p>}
      <div>
        <GraphCanvas dataPoints={dataPoints} />
      </div>
    </div>
  );
};

export default GuessWordGraph;
