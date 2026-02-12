import { useState } from "react";
import "./App.css";
import { useEffect } from "react";
import axios from "axios";
import type { Rectangle, RectEdge, SnowSector } from "./types/rectangle";
import { RectangleDrawer } from "./components/rectangleDrawer";

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
