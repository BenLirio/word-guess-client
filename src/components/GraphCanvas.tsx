import React, { useRef, useEffect, useState, useCallback } from "react";

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

    const targetRadius = 8; // Same as the target circle radius
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;

    const targetX = 50 + target.x * (rect.width - 100);
    const targetY = rect.height - 50 - target.y * (rect.height - 100);

    dataPoints.forEach(({ x, y }) => {
      const canvasX = 50 + x * (rect.width - 100);
      const canvasY = rect.height - 50 - y * (rect.height - 100);

      const distance = Math.sqrt(
        Math.pow(canvasX - targetX, 2) + Math.pow(canvasY - targetY, 2)
      );

      if (distance <= targetRadius) {
        setShowWinModal(true); // Show the win modal
      }
    });
  }, [dataPoints, target]);

  const drawGrid = (ctx: CanvasRenderingContext2D, rect: DOMRect) => {
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;

    const gridY = rect.height - 50 - 0.5 * (rect.height - 100);
    const gridX = 50 + 0.5 * (rect.width - 100);

    // Draw horizontal grid line
    ctx.beginPath();
    ctx.moveTo(50, gridY);
    ctx.lineTo(rect.width - 50, gridY);
    ctx.stroke();

    // Draw vertical grid line
    ctx.beginPath();
    ctx.moveTo(gridX, rect.height - 50);
    ctx.lineTo(gridX, 50);
    ctx.stroke();
  };

  const drawAxisLabels = (ctx: CanvasRenderingContext2D, rect: DOMRect) => {
    const gridY = rect.height - 50 - 0.5 * (rect.height - 100);
    const gridX = 50 + 0.5 * (rect.width - 100);

    ctx.fillStyle = "white";
    ctx.font = "16px Arial";

    // Horizontal axis labels
    ctx.fillText("big", 20, gridY + 5);
    ctx.fillText("small", rect.width - 40, gridY + 5);

    // Vertical axis labels
    ctx.fillText("cool", gridX - 20, rect.height - 30);
    ctx.fillText("lame", gridX - 20, 40);
  };

  const drawAxisArrows = useCallback(
    (ctx: CanvasRenderingContext2D, rect: DOMRect) => {
      const gridY = rect.height - 50 - 0.5 * (rect.height - 100);
      const gridX = 50 + 0.5 * (rect.width - 100);

      ctx.fillStyle = "white";

      // Horizontal axis arrows
      drawArrow(ctx, rect.width - 50, gridY, -10, -5, -10, 5); // Right end
      drawArrow(ctx, 50, gridY, 10, -5, 10, 5); // Left end

      // Vertical axis arrows
      drawArrow(ctx, gridX, 50, -5, 10, 5, 10); // Up end
      drawArrow(ctx, gridX, rect.height - 50, -5, -10, 5, -10); // Down end
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
        const canvasX = 50 + x * (rect.width - 100);
        const canvasY = rect.height - 50 - y * (rect.height - 100);

        ctx.beginPath();
        ctx.arc(canvasX, canvasY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = "rgba(75, 192, 192, 0.6)";
        ctx.fill();
      });
    },
    [dataPoints]
  );

  const drawTarget = useCallback(
    (ctx: CanvasRenderingContext2D, rect: DOMRect) => {
      if (!target) return;

      const targetX = 50 + target.x * (rect.width - 100);
      const targetY = rect.height - 50 - target.y * (rect.height - 100);

      ctx.beginPath();
      ctx.arc(targetX, targetY, 8, 0, 2 * Math.PI);
      ctx.strokeStyle = "red";
      ctx.lineWidth = 2;
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
      x: Math.random(), // Random x between 0 and 1
      y: Math.random(), // Random y between 0 and 1
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
