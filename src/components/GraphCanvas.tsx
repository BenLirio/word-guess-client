import React, { useRef, useEffect, useState, useCallback } from "react";

// Constants for canvas layout
const CANVAS_MARGIN = 50;
const DATA_POINT_RADIUS = 3;
const ARROW_SIZE = 10;
const TARGET_SIZE_FACTOR = 0.15; // Adjust this value to control the target size relative to the canvas width

interface GraphCanvasProps {
  dataPoints: { x: number; y: number }[];
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({ dataPoints }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [target, setTarget] = useState<{ x: number; y: number } | null>(null);
  const [showWinModal, setShowWinModal] = useState(false);

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
    if (!target) return;

    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const targetX = CANVAS_MARGIN + target.x * (rect.width - 2 * CANVAS_MARGIN);
    const targetY =
      rect.height -
      CANVAS_MARGIN -
      target.y * (rect.height - 2 * CANVAS_MARGIN);

    // Scale the target size based on the canvas dimensions
    const scaledTargetSize = rect.width * TARGET_SIZE_FACTOR;

    dataPoints.forEach(({ x, y }) => {
      const canvasX = CANVAS_MARGIN + x * (rect.width - 2 * CANVAS_MARGIN);
      const canvasY =
        rect.height - CANVAS_MARGIN - y * (rect.height - 2 * CANVAS_MARGIN);

      // Check if the data point is inside the target's bounding box
      if (
        canvasX >= targetX - scaledTargetSize / 2 &&
        canvasX <= targetX + scaledTargetSize / 2 &&
        canvasY >= targetY - scaledTargetSize / 2 &&
        canvasY <= targetY + scaledTargetSize / 2
      ) {
        setShowWinModal(true); // Show the win modal
      }
    });
  }, [dataPoints, target]);

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

  const drawAxisLabels = (ctx: CanvasRenderingContext2D, rect: DOMRect) => {
    const gridY =
      rect.height - CANVAS_MARGIN - 0.5 * (rect.height - 2 * CANVAS_MARGIN);
    const gridX = CANVAS_MARGIN + 0.5 * (rect.width - 2 * CANVAS_MARGIN);

    ctx.fillStyle = "#00FF00"; // Neon green
    ctx.font = "16px 'Press Start 2P', monospace"; // Retro pixelated font

    // Horizontal axis labels
    const leftWord = "big";
    ctx.save();
    ctx.translate(CANVAS_MARGIN - 10, gridY + leftWord.length * 4);
    ctx.rotate(-Math.PI / 2); // Rotate 90 degrees counterclockwise
    ctx.fillText(leftWord, 0, 0);
    ctx.restore();

    const rightWord = "small";
    ctx.save();
    ctx.translate(
      rect.width - CANVAS_MARGIN + 20,
      gridY + rightWord.length * 4
    );
    ctx.rotate(-Math.PI / 2); // Rotate 90 degrees counterclockwise
    ctx.fillText(rightWord, 0, 0);
    ctx.restore();

    // Vertical axis labels
    ctx.fillText("cool", gridX - 20, rect.height - CANVAS_MARGIN + 20);
    ctx.fillText("lame", gridX - 20, CANVAS_MARGIN - 10);
  };

  const drawAxisArrows = useCallback(
    (ctx: CanvasRenderingContext2D, rect: DOMRect) => {
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
      const scaledTargetSize = rect.width * TARGET_SIZE_FACTOR;

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
  }, [drawAxisArrows, drawDataPoints, drawTarget]);

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
    // Generate a random target point when the component mounts
    const randomTarget = {
      x: Math.random() * (1 - TARGET_SIZE_FACTOR) + TARGET_SIZE_FACTOR / 2, // Ensure the target stays within horizontal bounds
      y: Math.random() * (1 - TARGET_SIZE_FACTOR) + TARGET_SIZE_FACTOR / 2, // Ensure the target stays within vertical bounds
    };
    setTarget(randomTarget);
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
      {showWinModal && (
        <div
          style={{
            width: "100%",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "yellow",
            padding: "20px",
            borderRadius: "10px",
            textAlign: "center",
            animation: "pop-in 0.5s ease",
          }}
        >
          <h1 style={{ fontSize: "2rem", color: "red" }}>🎉 YOU WIN! 🎉</h1>
          <p style={{ fontSize: "1.2rem" }}>Great job hitting the target!</p>
        </div>
      )}
    </div>
  );
};

export default GraphCanvas;
