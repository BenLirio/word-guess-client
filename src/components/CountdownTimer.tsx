import React, { useEffect, useState } from "react";
import "./CountdownTime.css";
import { getTimeUntilNextGraph } from "../api";

const CountdownTimer: React.FC = () => {
  const targetTime = new Date("2025-04-05T00:00:00").getTime(); // Dummy timestamp
  const [timeLeft, setTimeLeft] = useState(targetTime - Date.now());

  useEffect(() => {
    const fetchTimeUntilNextGraph = async () => {
      try {
        const { timeUntilNextGraph } = await getTimeUntilNextGraph({});
        setTimeLeft(timeUntilNextGraph);
      } catch (error) {
        console.error("Error fetching time until next graph:", error);
      }
    };

    fetchTimeUntilNextGraph();

    const intervalId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1000);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetTime]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="countdown-timer">
      <p>Next graph in: {timeLeft > 0 ? formatTime(timeLeft) : "Now!"}</p>
    </div>
  );
};

export default CountdownTimer;
