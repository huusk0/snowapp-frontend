import { useState } from "react";
import "../App.css";
import type {
  Point,
  Rectangle,
  RectEdge,
  SnowSector,
} from "../types/rectangle";
import { RectangleDrawerv1 } from "../components/rectangleDrawerv1";
import {
  calculateRectangleCorners,
  calculateRectangleSectors,
  calculateTSPPath0,
} from "../services/rectangleService";

export const HomePage_v1 = () => {
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [edges, setEdges] = useState<RectEdge[]>([]);
  const [sectors, setSectors] = useState<SnowSector[]>([]);
  const [path, setPath] = useState<Point[]>([]);
  const [errorMessage] = useState<string | null>(null);

  const handleRectangleCorners = async () => {
    try {
      const corners = await calculateRectangleCorners(rectangles);
      setEdges(corners);
    } catch (error) {
      console.error("Error sending rectangles:", error);
    }
  };

  const handleRectangleSectors = async () => {
    try {
      const sectors = await calculateRectangleSectors(rectangles);
      setSectors(sectors);
    } catch (error) {
      console.error("Error sending rectangles:", error);
    }
  };

  const handleTSPPath = async () => {
    try {
      const path = await calculateTSPPath0(rectangles);
      setPath(path);
    } catch (error) {
      console.error("Error sending rectangles:", error);
    }
  };

  return (
    <>
      {errorMessage && (
        <div style={{ color: "red" }}>ERROR: {errorMessage}</div>
      )}
      <h3>Homepage of version 1</h3>
      <button onClick={handleRectangleCorners}>Corners</button>
      <button onClick={handleRectangleSectors}>Sectors</button>
      <button onClick={handleTSPPath}>Show path</button>
      <button
        onClick={() => {
          setRectangles([]);
          setEdges([]);
          setSectors([]);
          setPath([]);
        }}
      >
        reset
      </button>
      <div></div>
      <RectangleDrawerv1
        rectangles={rectangles}
        edges={edges}
        sectors={sectors}
        path={path}
        setRectangles={setRectangles}
        setEdges={setEdges}
        setSectors={setSectors}
        setPath={setPath}
      ></RectangleDrawerv1>
    </>
  );
};
