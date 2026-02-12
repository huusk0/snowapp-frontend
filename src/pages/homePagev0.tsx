import { useState } from "react";
import "../App.css";
import { useEffect } from "react";
import axios from "axios";
import type { Rectangle, RectEdge, SnowSector } from "../types/rectangle";
import { RectangleDrawer } from "../components/rectangleDrawer";
import { getGreeting } from "../services/greetingService";
import {
  calculateRectangleCorners,
  calculateRectangleSectors,
} from "../services/rectangleService";

export const HomePage_v0 = () => {
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [edges, setEdges] = useState<RectEdge[]>([]);
  const [sectors, setSectors] = useState<SnowSector[]>([]);
  const [greeting, setGreeting] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchGreeting = async () => {
      try {
        const response = await getGreeting();
        console.log(response);
        setGreeting(response);
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

  return (
    <>
      {errorMessage && (
        <div style={{ color: "red" }}>ERROR: {errorMessage}</div>
      )}
      {greeting && <div>we have a greeting: {greeting}</div>}
      {!greeting && <div>we dont have a greeting</div>}
      <h3>Homepage of version 0</h3>
      <button onClick={handleRectangleCorners}>Corners</button>
      <button onClick={handleRectangleSectors}>Sectors</button>
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
