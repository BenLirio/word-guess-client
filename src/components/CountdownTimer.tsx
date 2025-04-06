import React, { useEffect, useState } from "react";
import "./CountdownTime.css";
import { getTimeUntilNextGraph } from "../api";
import { useRefreshTriggerContext } from "../context/RefreshTriggerContext";

const CountdownTimer: React.FC = () => {
  const [timeOfNextGraph, setTimeOfNextGraph] = useState<number | null>(null);
  const [timeMod, setTimeMod] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const { refreshTrigger, setRefreshTrigger } = useRefreshTriggerContext();

  useEffect(() => {
    const fetchTimeUntilNextGraph = async () => {
      try {
        const { timeOfNextGraph, timeMod } = await getTimeUntilNextGraph({});
        setTimeOfNextGraph(timeOfNextGraph);
        setTimeMod(timeMod);
      } catch (error) {
        console.error("Error fetching time until next graph:", error);
      }
    };
    fetchTimeUntilNextGraph();

    const intervalId = setInterval(() => {
      if (timeOfNextGraph === null || timeMod === null) {
        return;
      }
      const now = Date.now();
      if (now >= timeOfNextGraph) {
        setTimeOfNextGraph((prevTimeOfNextGraph) => {
          if (prevTimeOfNextGraph === null) return null;
          return prevTimeOfNextGraph + timeMod;
        });

        // Toggle the refresh trigger when the countdown resets
        setRefreshTrigger(!refreshTrigger);
      }
      setTimeLeft(Math.max(0, timeOfNextGraph - now));
    }, 100);

    return () => clearInterval(intervalId);
  }, [timeMod, timeOfNextGraph, refreshTrigger, setRefreshTrigger]);

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="countdown-timer">
      {timeLeft != null && <p>Next graph in: {formatTime(timeLeft)}</p>}
    </div>
  );
};

export default CountdownTimer;
