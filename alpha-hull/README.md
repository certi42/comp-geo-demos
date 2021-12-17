# Alpha Hull

This is an interactive demo of alpha hulls.

## Key Features
 - Click to add points, drag to move them around, right-click to remove them.
 - Drag the slider to change the alpha threshold.
 - Click the corresponding checkboxes to view the Delaunay triangulation, or the bounding circle for the current alpha level.
 - Hover over an edge to see the minimum and maximum alpha values for that edge.

## Algorithm
 - Compute Delaunay Triangulation
 - For each edge in the triangulation:
     - Find alpha min:
        - if the edge passes through its dual Voronoi edge, alpha min is half the length of the edge
        - otherwise, it's the radius of the smaller of the two circles centered on either endpoint of the dual Voronoi edge.
    - Find alpha max:
        - it's the radius of the larger of the two circles centered on either endpoint of the dual Voronoi edge.
 - For a given alpha threshold, each Delaunay edge is part of the alpha hull if the threshold is in between that edge's computed alpha min and max values.