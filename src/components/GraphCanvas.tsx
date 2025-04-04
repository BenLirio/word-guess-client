import React, { useRef, useEffect } from "react";

interface GraphCanvasProps {
  dataPoints: { x: number; y: number }[];
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({ dataPoints }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const setAspectRatio = () => {
    if (containerRef.current) {
      const width = containerRef.current.offsetWidth;
      containerRef.current.style.height = `${width}px`;
    }
  };

  const drawGraph = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas resolution to match its rendered size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Scale the context for high-DPI screens
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid lines
    ctx.strokeStyle = "white";
    ctx.lineWidth = 1;

    // Horizontal grid line at y = 0.5
    const gridY = rect.height - 50 - 0.5 * (rect.height - 100);
    ctx.beginPath();
    ctx.moveTo(50, gridY);
    ctx.lineTo(rect.width - 50, gridY);
    ctx.stroke();

    // Vertical grid line at x = 0.5
    const gridX = 50 + 0.5 * (rect.width - 100);
    ctx.beginPath();
    ctx.moveTo(gridX, rect.height - 50);
    ctx.lineTo(gridX, 50);
    ctx.stroke();

    // Draw labels
    ctx.fillStyle = "white";
    ctx.font = "16px Arial";
    ctx.fillText("big", 50, rect.height - 20);
    ctx.fillText("small", rect.width - 70, rect.height - 20);
    ctx.fillText("cool", 10, rect.height - 50);
    ctx.fillText("lame", 10, 60);

    // Draw data points
    dataPoints.forEach(({ x, y }) => {
      const canvasX = 50 + x * (rect.width - 100);
      const canvasY = rect.height - 50 - y * (rect.height - 100);

      ctx.beginPath();
      ctx.arc(canvasX, canvasY, 5, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(75, 192, 192, 0.6)";
      ctx.fill();
    });
  };

  useEffect(() => {
    setAspectRatio();
    window.addEventListener("resize", setAspectRatio);
    return () => {
      window.removeEventListener("resize", setAspectRatio);
    };
  }, []);

  useEffect(() => {
    drawGraph();
  }, [dataPoints]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        position: "relative",
        backgroundColor: "black",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
};

export default GraphCanvas;
