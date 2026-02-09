import { useState, type JSX } from "react";
import "./App.css";
import { useRef, useEffect } from "react";

type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type Point = {
  x: number;
  y: number;
};

function drawGrid(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gridSize: number,
): void {
  ctx.strokeStyle = "#e0e0e032";
  ctx.lineWidth = 1;

  for (let x = 0; x <= width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
}

type RectangleDrawerProps = {
  rectangles: Rectangle[];
  setRectangles: React.Dispatch<React.SetStateAction<Rectangle[]>>;
};

function RectangleDrawer({
  rectangles,
  setRectangles,
}: RectangleDrawerProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [start, setStart] = useState<Point | null>(null);
  const [current, setCurrent] = useState<Point | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx, canvas.width, canvas.height, 25);
    // Draw saved rectangles
    ctx.strokeStyle = "blue";
    rectangles.forEach((r) => {
      ctx.fillStyle = "rgba(0, 0, 255, 0.75)"; // translucent fill
      ctx.fillRect(r.x, r.y, r.width, r.height);

      ctx.strokeStyle = "blue";
      ctx.strokeRect(r.x, r.y, r.width, r.height);
    });

    // Draw preview rectangle
    if (start && current) {
      ctx.strokeStyle = "red";
      ctx.strokeRect(
        Math.min(start.x, current.x),
        Math.min(start.y, current.y),
        Math.abs(current.x - start.x),
        Math.abs(current.y - start.y),
      );
    }
  }, [rectangles, start, current]);

  function getMousePos(e: React.MouseEvent<HTMLCanvasElement>): Point {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function onMouseDown(e: React.MouseEvent<HTMLCanvasElement>): void {
    setStart(getMousePos(e));
    setCurrent(null);
  }

  function onMouseMove(e: React.MouseEvent<HTMLCanvasElement>): void {
    if (!start) return;
    setCurrent(getMousePos(e));
  }

  function onMouseUp(): void {
    if (!start || !current) return;

    const x = Math.floor(Math.min(start.x, current.x));
    const y = Math.floor(Math.min(start.y, current.y));
    const width = Math.abs(current.x - start.x);
    const height = Math.abs(current.y - start.y);

    setRectangles((prev) => [...prev, { x, y, width, height }]);
    setStart(null);
    setCurrent(null);
  }

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={300}
      style={{ border: "1px solid black", cursor: "crosshair" }}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
    />
  );
}

function App() {
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  return (
    <>
      <h1>SnowApp</h1>{" "}
      <button onClick={() => console.log({ rectangles })}>hello</button>
      <button
        onClick={() => {
          setRectangles([]);
        }}
      >
        reset
      </button>
      <div></div>
      <RectangleDrawer
        rectangles={rectangles}
        setRectangles={setRectangles}
      ></RectangleDrawer>
    </>
  );
}

export default App;
