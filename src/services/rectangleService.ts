import axios from "axios";
import type { RectEdge, SnowSector, Rectangle } from "../types/rectangle";

export const calculateRectangleCorners = async (
  rectangles: Rectangle[],
): Promise<RectEdge[]> => {
  const response = await axios.post<RectEdge[]>("/api/rectangles/", rectangles);
  console.log("API Response: ", response);
  return response.data;
};

export const calculateRectangleSectors = async (
  rectangles: Rectangle[],
): Promise<SnowSector[]> => {
  const response = await axios.post<SnowSector[]>(
    "/api/snowsectors/",
    rectangles,
  );
  console.log("API Response: ", response);
  return response.data;
};
