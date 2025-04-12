import React, { useState, useEffect, useRef } from "react";
import { GuessWordResponse } from "../types";
import "./WinModal.css"; // Import the new CSS file
import { postWin } from "../api";

interface WinModalProps {
  winningGuess: GuessWordResponse;
  closeModal: () => void;
}

const WinModal: React.FC<WinModalProps> = ({
  winningGuess,
  closeModal,
}: {
  winningGuess: GuessWordResponse;
  closeModal: () => void;
}) => {
  const [username, setUsername] = useState("");
  const [postCompleted, setPostCompleted] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const handlePostToDiscord = async () => {
    try {
      await postWin({ token: winningGuess.token!, username });
      setPostCompleted(true); // Mark post as completed
    } catch (error) {
      console.error("Failed to post to Discord:", error);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      closeModal();
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="win-modal-overlay">
      <div className="win-modal" ref={modalRef}>
        <button className="win-modal-close-button" onClick={closeModal}>
          &times;
        </button>
        <h1 className="win-modal-title">🎉 YOU WIN! 🎉</h1>
        <p className="win-modal-message">Great job hitting the target!</p>
        <p className="win-modal-details">
          You won with:{" "}
          <span className="win-modal-word">{winningGuess.word}</span>
        </p>
        {!postCompleted && (
          <input
            type="text"
            className="win-modal-username-input"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        )}
        {!postCompleted && (
          <button
            className="win-modal-post-button"
            onClick={handlePostToDiscord}
          >
            Save to Leaderboard
          </button>
        )}
        {postCompleted && (
          <footer className="footer">
            <p>
              Thanks for playing, for bug reports or feature requests please
              join our{" "}
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
    </div>
  );
};

export default WinModal;
