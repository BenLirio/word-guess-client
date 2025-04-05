import React, { useState } from "react";
import { GuessWordResponse } from "../types";
import "./WinModal.css"; // Import the new CSS file
import { postWin } from "../api";

interface WinModalProps {
  winningGuess: GuessWordResponse;
}

const WinModal: React.FC<WinModalProps> = ({
  winningGuess,
}: {
  winningGuess: GuessWordResponse;
}) => {
  const [username, setUsername] = useState("");
  const [postCompleted, setPostCompleted] = useState(false);

  const handlePostToDiscord = async () => {
    try {
      await postWin({ token: winningGuess.token!, username });
      setPostCompleted(true); // Mark post as completed
    } catch (error) {
      console.error("Failed to post to Discord:", error);
    }
  };

  return (
    <div className="win-modal">
      <h1 className="win-modal-title">🎉 YOU WIN! 🎉</h1>
      <p className="win-modal-message">Great job hitting the target!</p>
      <p className="win-modal-details">
        Your winning guess: {winningGuess.word}
      </p>
      <input
        type="text"
        className="win-modal-username-input"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      {!postCompleted && (
        <button className="win-modal-post-button" onClick={handlePostToDiscord}>
          Post to Discord
        </button>
      )}
      {postCompleted && (
        <footer className="footer">
          <p>
            Thanks for playing, you can see winners on{" "}
            <a
              href="https://discord.gg/byVdbGEk"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Discord
            </a>
            !
          </p>
        </footer>
      )}
    </div>
  );
};

export default WinModal;
