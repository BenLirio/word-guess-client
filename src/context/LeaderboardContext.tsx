import React, { createContext, useContext, useEffect, useState } from "react";
import {
  GetLeaderboardRequest,
  GetLeaderboardResponse,
  LeaderboardEntry,
} from "../types";
import { getLeaderboard } from "../api";
import { useRefreshTriggerContext } from "./RefreshTriggerContext";

interface LeaderboardContextValue {
  leaderboardEntries: Record<string, LeaderboardEntry>;
  loading: boolean;
  error: string | null;
}

const LeaderboardContext = createContext<LeaderboardContextValue | undefined>(
  undefined
);

export const LeaderboardProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { refreshTrigger } = useRefreshTriggerContext();
  const [leaderboardEntries, setLeaderboardEntries] = useState<
    Record<string, LeaderboardEntry>
  >({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let lastTimestamp = 0;
    const fetchLeaderboard = async (timestamp: number) => {
      setLoading(true);
      setError(null);

      const request: GetLeaderboardRequest = { afterTimestamp: timestamp };

      try {
        const response: GetLeaderboardResponse = await getLeaderboard(request);
        setLeaderboardEntries((prevEntries) => {
          const newEntries = lastTimestamp === 0 ? {} : { ...prevEntries };
          response.leaderboardEntries.forEach((entry) => {
            newEntries[entry.id] = entry;
          });
          return newEntries;
        });
        lastTimestamp = response.timestamp;
      } catch (err) {
        setError("Failed to fetch leaderboard data.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard(lastTimestamp);

    const intervalId = setInterval(() => {
      fetchLeaderboard(lastTimestamp);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [refreshTrigger]);

  return (
    <LeaderboardContext.Provider value={{ loading, error, leaderboardEntries }}>
      {children}
    </LeaderboardContext.Provider>
  );
};

export const useLeaderboard = (): LeaderboardContextValue => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error("useLeaderboard must be used within a LeaderboardProvider");
  }
  return context;
};
