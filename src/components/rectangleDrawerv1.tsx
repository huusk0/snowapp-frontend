import { useState, type JSX } from "react";
import { useRef, useEffect } from "react";

import type {
  Rectangle,
  Point,
  RectEdge,
  SnowSector,
} from "../types/rectangle";

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

function drawArrow(
  ctx: CanvasRenderingContext2D,
  from: Point,
  to: Point,
  scale: number,
) {
  const headLength = 15; // length of arrow head
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const angle = Math.atan2(dy, dx);

  // Draw line
  ctx.beginPath();
  ctx.moveTo(from.x * scale, from.y * scale);
  ctx.lineTo(to.x * scale, to.y * scale);
  ctx.stroke();

  // Draw arrow head
  ctx.beginPath();
  ctx.moveTo(to.x * scale, to.y * scale);
  ctx.lineTo(
    to.x * scale - headLength * Math.cos(angle - Math.PI / 6),
    to.y * scale - headLength * Math.sin(angle - Math.PI / 6),
  );
  ctx.lineTo(
    to.x * scale - headLength * Math.cos(angle + Math.PI / 6),
    to.y * scale - headLength * Math.sin(angle + Math.PI / 6),
  );
  ctx.lineTo(to.x * scale, to.y * scale);
  ctx.fill();
}

type RectangleDrawerProps = {
  rectangles: Rectangle[];
  edges: RectEdge[];
  sectors: SnowSector[];
  path: Point[];
  setRectangles: React.Dispatch<React.SetStateAction<Rectangle[]>>;
  setEdges: React.Dispatch<React.SetStateAction<RectEdge[]>>;
  setSectors: React.Dispatch<React.SetStateAction<SnowSector[]>>;
  setPath: React.Dispatch<React.SetStateAction<Point[]>>;
};

export const RectangleDrawerv1 = ({
  rectangles,
  edges,
  sectors,
  path,
  setRectangles,
  setEdges,
  setSectors,
  setPath,
}: RectangleDrawerProps): JSX.Element => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [start, setStart] = useState<Point | null>(null);
  const [current, setCurrent] = useState<Point | null>(null);
  const [scale, setScale] = useState<number>(4);
  const gridSize = 10;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Fill the canvas background
    ctx.fillStyle = "#777777"; // set your desired color
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawGrid(ctx, canvas.width, canvas.height, gridSize * scale);
    // Draw saved rectangles
    ctx.strokeStyle = "blue";
    rectangles.forEach((r) => {
      ctx.fillStyle = "rgba(0, 0, 255, 0.75)"; // translucent fill
      const x = r.x * scale * gridSize;
      const y = r.y * scale * gridSize;
      const width = r.width * scale;
      const height = r.height * scale;
      ctx.fillRect(x, y, width, height);

      ctx.strokeStyle = "blue";
      ctx.strokeRect(x, y, width, height);
    });

    //Draw saved rect-edges
    ctx.fillStyle = "green";
    // Draw points for each rectangle
    edges.forEach((e: RectEdge) => {
      const points = [e.topleft, e.topright, e.bottomleft, e.bottomright];
      points.forEach((p) => {
        ctx.beginPath();
        console.log(`pointssss x: ${p.x} y: ${p.y}`);
        ctx.arc(p.x, p.y, 3, 0, 2 * Math.PI); // 3px radius
        ctx.fill();
      });
    });

    //Draw saved sectors (as points)
    sectors.forEach((s: SnowSector) => {
      const p = s.coords;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(p.x * scale, p.y * scale, 3, 0, 2 * Math.PI);
      ctx.fill();
    });

    //Draw saved path
    ctx.strokeStyle = "black";
    ctx.fillStyle = "black";
    ctx.lineWidth = 1;
    const n = path.length;
    for (let i = 0; i < path.length - 1; i++) {
      const colorValue = (i / (n - 1)) * 255;
      const r = colorValue;
      const g = colorValue;
      const b = colorValue;
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      drawArrow(ctx, path[i], path[i + 1], scale);
    }

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
  }, [rectangles, edges, sectors, path, scale, start, current]);

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

    const rawX = Math.min(start.x, current.x);
    const rawY = Math.min(start.y, current.y);
    const rawWidth = Math.floor(Math.abs(current.x - start.x));
    const rawHeight = Math.floor(Math.abs(current.y - start.y));

    const x = Math.floor(rawX / (gridSize * scale));
    const y = Math.floor(rawY / (gridSize * scale));
    const width = Math.ceil(rawWidth / scale);
    const height = Math.ceil(rawHeight / scale);

    setRectangles([...rectangles, { x, y, width, height }]);
    setStart(null);
    setCurrent(null);
    setEdges([]);
    setSectors([]);
    setPath([]);
    console.log(
      `rect{x: ${x} y: ${y} width: ${width}, height ${height} scale:   ${scale}`,
    );
  };

  const handleZoom = (direction: "in" | "out") => {
    setScale((prevScale) => {
      const zoomStep = 0.1;

      if (direction === "in") {
        return prevScale + zoomStep;
      } else {
        return Math.max(0.1, prevScale - zoomStep); // prevent going to 0 or negative
      }
    });
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: "1px solid black", cursor: "crosshair" }}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />
      <>{scale}</>
      <button onClick={() => handleZoom("in")}>+</button>
      <button onClick={() => handleZoom("out")}>-</button>
    </>
  );
};
