import React, { useState } from "react";
import { listWins } from "../api";
import { ListWinsResponse } from "../types";
import "./WinList.css"; // Import the new CSS file

const WinList: React.FC = () => {
  const [wins, setWins] = useState<{ username: string; winCount: number }[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasLoaded, setHasLoaded] = useState<boolean>(false);

  const fetchWins = async () => {
    setIsLoading(true);
    try {
      const response: ListWinsResponse = await listWins({});
      const sortedWins = (response.wins || []).sort(
        (a, b) => b.winCount - a.winCount
      );
      setWins(sortedWins);
      setError(null);
      setHasLoaded(true);
    } catch (err) {
      console.error("Failed to fetch wins:", err);
      setError("Failed to load win data.");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) {
    return <div className="win-list-error">{error}</div>;
  }

  return (
    <div className="win-list">
      <h2>Win List</h2>
      <p>
        <em>Each user can only win once per word graph.</em>
      </p>
      <button
        onClick={fetchWins}
        className="refresh-button"
        disabled={isLoading}
      >
        {isLoading ? "Loading..." : hasLoaded ? "Refresh" : "Load"}
      </button>
      <table className="win-list-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Wins</th>
          </tr>
        </thead>
        <tbody>
          {wins.map((win, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{win.username}</td>
              <td>{win.winCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default WinList;
