import { useState, type JSX } from "react";
import "./App.css";
import { useRef, useEffect } from "react";
import axios from "axios";

import type { Rectangle, Point, RectEdge, SnowSector } from "./types/rectangle";

const drawGrid = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gridSize: number,
): void => {
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
};

type RectangleDrawerProps = {
  rectangles: Rectangle[];
  edges: RectEdge[];
  sectors: SnowSector[];
  setRectangles: React.Dispatch<React.SetStateAction<Rectangle[]>>;
};

const RectangleDrawer = ({
  rectangles,
  edges,
  sectors,
  setRectangles,
}: RectangleDrawerProps): JSX.Element => {
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

    //Draw saved rect-edges
    ctx.fillStyle = "green";
    // Draw points for each rectangle
    edges.forEach((e: RectEdge) => {
      const points = [e.topleft, e.topright, e.bottomleft, e.bottomright];
      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI); // 3px radius
        ctx.fill();
      });
    });

    //Draw saved sectors (as points)
    sectors.forEach((s: SnowSector) => {
      const p = s.coords;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI);
      ctx.fill();
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
  }, [rectangles, edges, sectors, start, current]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    setStart(getMousePos(e));
    setCurrent(null);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>): void => {
    if (!start) return;
    setCurrent(getMousePos(e));
  };

  const onMouseUp = (): void => {
    if (!start || !current) return;

    const x = Math.floor(Math.min(start.x, current.x));
    const y = Math.floor(Math.min(start.y, current.y));
    const width = Math.abs(current.x - start.x);
    const height = Math.abs(current.y - start.y);

    setRectangles((prev) => [...prev, { x, y, width, height }]);
    setStart(null);
    setCurrent(null);
  };

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
};

const App = () => {
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [edges, setEdges] = useState<RectEdge[]>([]);
  const [sectors, setSectors] = useState<SnowSector[]>([]);
  const [greeting, setGreeting] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const response = await axios.get("api/greeting/");
        console.log(response);
        setGreeting(response.data.text);
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 500) {
            setErrorMessage("Server error. Please try again later.");
          } else {
            setErrorMessage(
              error.response?.data?.message ?? "Something went wrong",
            );
          }
        } else {
          setErrorMessage("Unexpected error occurred");
        }
      }
    };

    fetchGreeting();
  }, []);

  const calculateRectangleCorners = async () => {
    try {
      const response = await axios.post<RectEdge[]>(
        "api/rectangles/",
        rectangles,
      );
      console.log("API Response:", response);
      setEdges(response.data);
    } catch (error) {
      console.error("Error sending rectangles:", error);
    }
  };

  const calculateRectangleSectors = async () => {
    try {
      const response = await axios.post<SnowSector[]>(
        "/api/snowsectors/",
        rectangles,
      );
      console.log("API Response: ", response);
      setSectors(response.data);
    } catch (error) {
      console.error("Error sending rectangles:", error);
    }
  };

  return (
    <>
      {errorMessage && (
        <div style={{ color: "red" }}>ERROR: {errorMessage}</div>
      )}
      {greeting && <div>we have a greeting: {greeting}</div>}
      {!greeting && <div>we dont have a greeting</div>}
      <h1>SnowApp</h1>
      <button onClick={calculateRectangleCorners}>Corners</button>
      <button onClick={calculateRectangleSectors}>Sectors</button>
      <button
        onClick={() => {
          setRectangles([]);
          setEdges([]);
          setSectors([]);
        }}
      >
        reset
      </button>
      <div></div>
      <RectangleDrawer
        rectangles={rectangles}
        edges={edges}
        sectors={sectors}
        setRectangles={setRectangles}
      ></RectangleDrawer>
    </>
  );
};

export default App;
