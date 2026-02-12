export type Rectangle = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type Point = {
  x: number;
  y: number;
};

export type RectEdge = {
  topleft: Point;
  topright: Point;
  bottomleft: Point;
  bottomright: Point;
};

export type SnowSector = {
  coords: Point;
  snow_load: number;
  color: string;
  dump_site: boolean;
};
