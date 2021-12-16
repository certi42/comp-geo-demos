let showVoronoi, showDelauney, showCircles;

function computeVoronoiDiagram() {
    const points = draggables.map(d => d.position());
    const delauney = d3.Delaunay.from(points);
    const voronoi = delauney.voronoi();


    if (showVoronoi) {
        const voronoiCells = [];
        for (let i = 0; i < points.length; i++) {
            voronoiCells.push([voronoi.renderCell(i), draggables[i].color]);
        }
        vd.selectAll("path")
            .data(voronoiCells)
            .join("path")
            .attr('d', d => d[0])
            .attr('fill', d => d[1])
            .attr('stroke', 'black')
            .attr('stroke-width', '1px');
    } else {
        vd.selectAll("path").remove();
    }

    if (showDelauney) {
        const delauneyTriangles = [];
        if (points.length >= 3) {
            for (let i = 0; i < delauney.triangles.length / 3; i++) {
                delauneyTriangles.push(delauney.renderTriangle(i))
            }
        }
        dt.selectAll("path")
            .data(delauneyTriangles)
            .join("path")
            .attr('d', d => d)
            .attr('fill', 'none')
            .attr('stroke', 'black')
            .attr('stroke-width', '1px');
    } else {
        dt.selectAll("path").remove();
    }

    if (showCircles) {
        const emptyCircles = [];
        for (let i = 0; i < voronoi.circumcenters.length; i += 2) {
            let x = voronoi.circumcenters[i];
            let y = voronoi.circumcenters[i + 1];
            if (isNaN(x) || isNaN(y)) {
                continue;
            }

            const t0 = delauney.triangles[i * 3 / 2];
            let radius = Math.sqrt(Math.pow(x - delauney.points[t0 * 2], 2) + Math.pow(delauney.points[t0 * 2 + 1] - y, 2))
            emptyCircles.push({ x, y, radius });
        }

        vv.selectAll("circle")
            .data(emptyCircles)
            .join('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', 5)
            .attr('fill', 'red')
        ec.selectAll("circle")
            .data(emptyCircles)
            .join('circle')
            .attr('cx', d => d.x)
            .attr('cy', d => d.y)
            .attr('r', d => d.radius)
            .attr('stroke', 'blue')
            .attr('stroke-dasharray', 5)
            .attr('fill', 'none')
    } else {
        ec.html("")
        vv.html("")
    }
}

window.addEventListener('load', () => {
    const showVoronoiCheckbox = document.getElementById('show-voronoi');
    const showDelauneyCheckbox = document.getElementById('show-delauney');
    const showCirclesCheckbox = document.getElementById('show-circles');

    showVoronoiCheckbox.oninput = () => {
        showVoronoi = showVoronoiCheckbox.checked;
        computeVoronoiDiagram();
    }

    showDelauneyCheckbox.oninput = () => {
        showDelauney = showDelauneyCheckbox.checked;
        computeVoronoiDiagram();
    }

    showCirclesCheckbox.oninput = () => {
        showCircles = showCirclesCheckbox.checked;
        computeVoronoiDiagram();
    }
})