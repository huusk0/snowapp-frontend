Hello world

VERSION 0:

- Draw 1 rectangle at the time into the canvas, representing an area you want to clear out of snow.
- Use buttons to send api request for different things about the drawn rectangle:
- "Corners": shows the corners of the rectangle
- "Sectors": Divides the rectangle into 10x10 sectors and shows their middle point. Green points show a full 10x10 area, red points where the 10x10 could not be completed. (Snow sectors will become important later when your snowplow can be filled with snow from sectors)
- "Show path": API calculates the shortest path between sectors, using a travelling salesman-algorithm, which is then presented in the frontend as a arrow path starting from top left corner.

KNOWN BUGS:
1.multiple rectangles breaks things
