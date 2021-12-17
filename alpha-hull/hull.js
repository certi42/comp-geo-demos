let alpha = 100;
let showCircles, showDelauney;

function computeAlphaHull() {
    const points = draggables.map(d => d.position())
    const pointPairs = [];
    for (let i = 0; i < points.length; i++) {
        for (let j = i + 1; j < points.length; j++) {
            pointPairs.push([points[i], points[j]])
        }
    }

    dt.html("");
    if (showDelauney) {
        const delauney = d3.Delaunay.from(points);
        dt.append("path")
            .attr("d", delauney.render())
            .attr("fill", "none")
            .attr("stroke", "gray")
    }

    ah.html("")
    for (const point of pointPairs) {
        const result = findEmptyCircle(point[0], point[1], alpha);
        if (result === null) {
            continue;
        }
        const [circleA, circleB] = result;
        if (circleIsEmpty(circleA.x, circleA.y, alpha, points)) {
            ah.append("line")
                .attr('x1', point[0][0])
                .attr('x2', point[1][0])
                .attr('y1', point[0][1])
                .attr('y2', point[1][1])
                .attr('stroke', 'black')
                .attr('stroke-width', '2px')
            if (showCircles) {
                ah.append("circle")
                    .attr("cx", circleA.x)
                    .attr('cy', circleA.y)
                    .attr('r', alpha)
                    .attr('fill', 'none')
                    .attr('stroke', 'black')
                    .attr('stroke', 'blue')
                    .attr('stroke-dasharray', 5)
            }
        }
        if (circleIsEmpty(circleB.x, circleB.y, alpha, points)) {
            ah.append("line")
                .attr('x1', point[0][0])
                .attr('x2', point[1][0])
                .attr('y1', point[0][1])
                .attr('y2', point[1][1])
                .attr('stroke', 'black')
                .attr('stroke-width', '2px')
            if (showCircles) {
                ah.append("circle")
                    .attr("cx", circleB.x)
                    .attr('cy', circleB.y)
                    .attr('r', alpha)
                    .attr('fill', 'none')
                    .attr('stroke', 'black')
                    .attr('stroke', 'blue')
                    .attr('stroke-dasharray', 5)
            }
        }
    }
}

function findEmptyCircle([x1, y1], [x2, y2], r) {
    let dist = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
    if (dist >= r * 2) {
        return null;
    }
    let x3 = (x1 + x2) / 2;
    let y3 = (y1 + y2) / 2;

    let cx = Math.sqrt(Math.pow(r, 2) - Math.pow(dist / 2, 2)) * (y1 - y2) / dist;
    let cy = Math.sqrt(Math.pow(r, 2) - Math.pow(dist / 2, 2)) * (x2 - x1) / dist;

    return [{ x: x3 + cx, y: y3 + cy }, { x: x3 - cx, y: y3 - cy }];
}

/**
 * Checks whether or not the circle centered at (x, y) with radius r contains 
 * any point in points.
 * @param {number} x x-coordinate of the center of the circle
 * @param {number} y y-coordinate of the center of the circle
 * @param {number} r radius of the circle
 * @param {[number, number][]} points list of points
 * @returns {boolean} whether or not the circle contains any of the points
 */
function circleIsEmpty(x, y, r, points) {
    for (const point of points) {
        const dist = Math.sqrt(Math.pow(x - point[0], 2) + Math.pow(y - point[1], 2))
        if (dist < r - 0.1) {
            return false;
        }
    }
    return true;
}

window.addEventListener('load', () => {
    const showDelauneyCheckbox = document.getElementById('show-delauney');
    const showCirclesCheckbox = document.getElementById('show-circles');

    showDelauneyCheckbox.oninput = () => {
        showDelauney = showDelauneyCheckbox.checked;
        computeAlphaHull();
    }

    showCirclesCheckbox.oninput = () => {
        showCircles = showCirclesCheckbox.checked;
        computeAlphaHull();
    }
})