import React, { useState } from "react";
import { Scatter } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { guessWord } from "../api"; // Import the API function

// Register Chart.js components
ChartJS.register(LinearScale, PointElement, Tooltip, Legend);

const GuessWordGraph: React.FC = () => {
  const [dataPoints, setDataPoints] = useState<{ x: number; y: number }[]>([]);
  const [word, setWord] = useState("");

  const handleGuess = async () => {
    if (!word) {
      alert("Please enter a word to guess.");
      return;
    }

    try {
      const response = await guessWord({ word });
      setDataPoints((prev) => [...prev, { x: response.x, y: response.y }]);
    } catch (error) {
      console.error("Error calling the API:", error);
      alert("Failed to fetch data from the API.");
    }
  };

  const chartData = {
    datasets: [
      {
        label: "Guess Word Results",
        data: dataPoints,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
      },
    ],
  };

  const chartOptions = {
    scales: {
      x: {
        min: 0,
        max: 1,
        title: {
          display: true,
          text: "X-Axis",
        },
      },
      y: {
        min: 0,
        max: 1,
        title: {
          display: true,
          text: "Y-Axis",
        },
      },
    },
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
      <button onClick={handleGuess}>Submit Guess</button>
      <Scatter data={chartData} options={chartOptions} />
    </div>
  );
};

export default GuessWordGraph;
