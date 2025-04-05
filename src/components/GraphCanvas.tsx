import React, { useRef, useEffect, useState, useCallback } from "react";
import { getSpectrum, getTarget } from "../api";
import { GetSpectrumResponse, GuessWordResponse, WordTarget } from "../types";
import WinModal from "./WinModal"; // Import the new WinModal component

// Constants for canvas layout
const CANVAS_MARGIN = 50;
const DATA_POINT_RADIUS = 3;
const ARROW_SIZE = 10;

interface GraphCanvasProps {
  dataPoints: GuessWordResponse[];
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({ dataPoints }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [target, setTarget] = useState<WordTarget | null>(null);
  const [winningGuess, setWinningGuess] = useState<GuessWordResponse | null>(
    null
  );
  const [spectrumLabels, setSpectrumLabels] =
    useState<GetSpectrumResponse | null>(null);

  const setAspectRatio = () => {
    if (containerRef.current) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const width = Math.min(windowWidth, windowHeight) * 0.8;
      containerRef.current.style.width = `${width}px`;

      const canvas = canvasRef.current;
      if (canvas) {
        canvas.style.width = `${width}px`;
        canvas.style.height = `${width}px`;
      }
    }
  };

  const checkWinCondition = useCallback(() => {
    const winningGuess = dataPoints.find(({ hitTarget }) => hitTarget);
    setWinningGuess(winningGuess || null);
  }, [dataPoints]);

  const drawGrid = (ctx: CanvasRenderingContext2D, rect: DOMRect) => {
    ctx.strokeStyle = "#00FF00"; // Neon green
    ctx.lineWidth = 1;

    const gridY =
      rect.height - CANVAS_MARGIN - 0.5 * (rect.height - 2 * CANVAS_MARGIN);
    const gridX = CANVAS_MARGIN + 0.5 * (rect.width - 2 * CANVAS_MARGIN);

    // Draw horizontal grid line
    ctx.beginPath();
    ctx.moveTo(CANVAS_MARGIN, gridY);
    ctx.lineTo(rect.width - CANVAS_MARGIN, gridY);
    ctx.stroke();

    // Draw vertical grid line
    ctx.beginPath();
    ctx.moveTo(gridX, rect.height - CANVAS_MARGIN);
    ctx.lineTo(gridX, CANVAS_MARGIN);
    ctx.stroke();
  };

  const drawAxisLabels = useCallback(
    (ctx: CanvasRenderingContext2D, rect: DOMRect) => {
      if (!spectrumLabels) return; // Wait until spectrum labels are fetched

      const gridY =
        rect.height - CANVAS_MARGIN - 0.5 * (rect.height - 2 * CANVAS_MARGIN);
      const gridX = CANVAS_MARGIN + 0.5 * (rect.width - 2 * CANVAS_MARGIN);

      ctx.fillStyle = "#E0E0E0"; // Light gray for labels
      ctx.font = "16px 'Press Start 2P', monospace"; // Retro pixelated font

      // Horizontal axis labels
      const leftWord = spectrumLabels.x.left;
      ctx.save();
      ctx.translate(CANVAS_MARGIN - 10, gridY + leftWord.length * 4);
      ctx.rotate(-Math.PI / 2); // Rotate 90 degrees counterclockwise
      ctx.fillText(leftWord, 0, 0);
      ctx.restore();

      const rightWord = spectrumLabels.x.right;
      ctx.save();
      ctx.translate(
        rect.width - CANVAS_MARGIN + 20,
        gridY + rightWord.length * 4
      );
      ctx.rotate(-Math.PI / 2); // Rotate 90 degrees counterclockwise
      ctx.fillText(rightWord, 0, 0);
      ctx.restore();

      // Vertical axis labels
      const topWord = spectrumLabels.y.left;
      ctx.fillText(
        spectrumLabels.y.left,
        gridX - topWord.length * 4,
        rect.height - CANVAS_MARGIN + 20
      );
      const bottomWord = spectrumLabels.y.right;
      ctx.fillText(
        spectrumLabels.y.right,
        gridX - bottomWord.length * 4,
        CANVAS_MARGIN - 10
      );
    },
    [spectrumLabels] // Dependencies
  );

  const drawAxisArrows = useCallback(
    (ctx: CanvasRenderingContext2D, rect: DOMRect) => {
      ctx.fillStyle = "#00FF00"; // Neon green
      const gridY =
        rect.height - CANVAS_MARGIN - 0.5 * (rect.height - 2 * CANVAS_MARGIN);
      const gridX = CANVAS_MARGIN + 0.5 * (rect.width - 2 * CANVAS_MARGIN);

      // Horizontal axis arrows
      drawArrow(
        ctx,
        rect.width - CANVAS_MARGIN,
        gridY,
        -ARROW_SIZE,
        -5,
        -ARROW_SIZE,
        5
      ); // Right end
      drawArrow(ctx, CANVAS_MARGIN, gridY, ARROW_SIZE, -5, ARROW_SIZE, 5); // Left end

      // Vertical axis arrows
      drawArrow(ctx, gridX, CANVAS_MARGIN, -5, ARROW_SIZE, 5, ARROW_SIZE); // Up end
      drawArrow(
        ctx,
        gridX,
        rect.height - CANVAS_MARGIN,
        -5,
        -ARROW_SIZE,
        5,
        -ARROW_SIZE
      ); // Down end
    },
    []
  );

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    dx1: number,
    dy1: number,
    dx2: number,
    dy2: number
  ) => {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx1, y + dy1);
    ctx.lineTo(x + dx2, y + dy2);
    ctx.closePath();
    ctx.fill();
  };

  const drawDataPoints = useCallback(
    (ctx: CanvasRenderingContext2D, rect: DOMRect) => {
      dataPoints.forEach(({ x, y }) => {
        const canvasX = CANVAS_MARGIN + x * (rect.width - 2 * CANVAS_MARGIN);
        const canvasY =
          rect.height - CANVAS_MARGIN - y * (rect.height - 2 * CANVAS_MARGIN);

        ctx.beginPath();
        ctx.arc(canvasX, canvasY, DATA_POINT_RADIUS, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(0, 255, 0, 0.8)"; // Glowing neon green
        ctx.shadowColor = "#00FF00";
        ctx.shadowBlur = 10;
        ctx.fill();
      });
    },
    [dataPoints]
  );

  const drawTarget = useCallback(
    (ctx: CanvasRenderingContext2D, rect: DOMRect) => {
      if (!target) return;

      // Calculate the target's position
      const targetX =
        CANVAS_MARGIN + target.x * (rect.width - 2 * CANVAS_MARGIN);
      const targetY =
        rect.height -
        CANVAS_MARGIN -
        target.y * (rect.height - 2 * CANVAS_MARGIN);

      // Scale the target size based on the canvas dimensions
      const scaledTargetSize = rect.width * target.size;

      // Draw the square target
      ctx.beginPath();
      ctx.rect(
        targetX - scaledTargetSize / 2,
        targetY - scaledTargetSize / 2,
        scaledTargetSize,
        scaledTargetSize
      );
      ctx.strokeStyle = "red"; // Glowing red
      ctx.lineWidth = 2;
      ctx.shadowColor = "red";
      ctx.shadowBlur = 15;
      ctx.stroke();
    },
    [target]
  );

  const drawGraph = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx, rect);
    drawAxisLabels(ctx, rect);
    drawAxisArrows(ctx, rect);
    drawDataPoints(ctx, rect);
    drawTarget(ctx, rect);
  }, [drawAxisArrows, drawAxisLabels, drawDataPoints, drawTarget]);

  useEffect(() => {
    setAspectRatio();
    window.addEventListener("resize", setAspectRatio);
    return () => {
      window.removeEventListener("resize", setAspectRatio);
    };
  }, []);

  useEffect(() => {
    drawGraph();
    checkWinCondition();
  }, [drawGraph, checkWinCondition]);

  useEffect(() => {
    // Fetch spectrum labels when the component mounts
    const fetchSpectrumLabels = async () => {
      try {
        const response = await getSpectrum({});
        setSpectrumLabels(response);
      } catch (error) {
        console.error("Failed to fetch spectrum labels:", error);
      }
    };

    fetchSpectrumLabels();
  }, []);

  useEffect(() => {
    // Fetch target
    const fetchTarget = async () => {
      try {
        const response = await getTarget({});
        setTarget(response);
      } catch (error) {
        console.error("Failed to fetch target:", error);
      }
    };

    fetchTarget();
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
      }}
    >
      <div
        style={{
          backgroundColor: "#2A2A2A",
          borderRadius: "5px",
          padding: "5px",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            width: "100%",
            height: "100%",
            display: "block",
            borderRadius: "10px",
          }}
        />
      </div>
      {winningGuess && <WinModal winningGuess={winningGuess} />}
    </div>
  );
};

export default GraphCanvas;
