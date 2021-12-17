let alpha = 100;
let showCircles, showDelauney;

function computeAlphaHull() {
    const points = draggables.map(d => d.position())
    const delauney = d3.Delaunay.from(points);

    ah.html("");
    const pointPairs = calculateAlphaLimits(delauney.voronoi([-200, -200, 1800, 1600]))
    for (const point of pointPairs) {
        alpha = parseInt(alpha)
        if (alpha > point.min.alpha && alpha < point.max.alpha) {
            const line = ah.append("line")
                .attr('x1', point.pi[0])
                .attr('x2', point.pj[0])
                .attr('y1', point.pi[1])
                .attr('y2', point.pj[1])
                .attr('stroke', 'black')
                .attr('stroke-width', '2px')
                .on('mouseenter', () => {
                    showAlphaBounds(point)
                    line.attr('stroke-width', '4px')
                })
                .on('mouseleave', () => {
                    ab.html("")
                    line.attr('stroke-width', '2px')
                })
            if (showCircles) {
                const circle = findEmptyCircle(point.pi, point.pj, alpha)[0]
                ah.append('circle')
                    .attr('r', alpha)
                    .attr('cx', circle.x)
                    .attr('cy', circle.y)
                    .attr('fill', 'none')
                    .attr('stroke', 'blue')
                    .attr('stroke-dasharray', 5)
            }
        }
    }

    dt.html("");
    if (showDelauney) {
        dt.append("path")
            .attr("d", delauney.render())
            .attr("fill", "none")
            .attr("stroke", "gray")
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

function calculateAlphaLimits(voronoi) {
    const { delaunay: { halfedges, inedges, hull, points, triangles }, circumcenters, vectors } = voronoi;
    const pointPairs = [];
    if (hull.length <= 1) return [];
    for (let i = 0, n = halfedges.length; i < n; ++i) {
        const j = halfedges[i];
        if (j < i) continue;
        const ti = Math.floor(i / 3) * 2;
        const tj = Math.floor(j / 3) * 2;
        const xi = circumcenters[ti];
        const yi = circumcenters[ti + 1];
        const xj = circumcenters[tj];
        const yj = circumcenters[tj + 1];


        const tri = triangles[i];
        const trj = triangles[j];

        const distA = dist(xi, yi, points[tri * 2], points[tri * 2 + 1]);
        const distB = dist(xj, yj, points[tri * 2], points[tri * 2 + 1]);

        if (intersects(xi, yi, xj, yj, points[tri * 2], points[tri * 2 + 1], points[trj * 2], points[trj * 2 + 1])) {
            const aMin = dist(points[tri * 2], points[tri * 2 + 1], points[trj * 2], points[trj * 2 + 1]) / 2
            const aMax = Math.max(distA, distB)
            pointPairs.push({
                pi: [points[tri * 2], points[tri * 2 + 1]],
                pj: [points[trj * 2], points[trj * 2 + 1]],
                min: {
                    alpha: aMin,
                    cx: (points[tri * 2] + points[trj * 2]) / 2,
                    cy: (points[tri * 2 + 1] + points[trj * 2 + 1]) / 2
                },
                max: {
                    alpha: aMax,
                    cx: distA == aMax ? xi : xj,
                    cy: distA == aMax ? yi : yj
                }
            })
        } else {

            const aMin = Math.min(distA, distB)
            const aMax = Math.max(distA, distB)
            pointPairs.push({
                pi: [points[tri * 2], points[tri * 2 + 1]],
                pj: [points[trj * 2], points[trj * 2 + 1]],
                min: {
                    alpha: aMin,
                    cx: distA == aMin ? xi : xj,
                    cy: distA == aMin ? yi : yj
                },
                max: {
                    alpha: aMax,
                    cx: distA == aMax ? xi : xj,
                    cy: distA == aMax ? yi : yj
                }
            })
        }
    }


    let h0, h1 = hull[hull.length - 1];
    for (let i = 0; i < hull.length; ++i) {
        h0 = h1, h1 = hull[i];
        const t = Math.floor(inedges[h1] / 3) * 2;
        const x = circumcenters[t];
        const y = circumcenters[t + 1];
        const v = h0 * 4;
        const p = voronoi._project(x, y, vectors[v + 2], vectors[v + 3]);
        if (p) {
            const pi = i > 0 ? i - 1 : hull.length - 1;
            const hp = hull[pi] * 2;
            const hc = hull[i] * 2;

            const distA = dist(x, y, points[hp], points[hp + 1]);
            const distB = dist(p[0], p[1], points[hp], points[hp + 1]);

            if (intersects(x, y, p[0], p[1], points[hp], points[hp + 1], points[hc], points[hc + 1])) {
                const aMin = dist(points[hp], points[hp + 1], points[hc], points[hc + 1]) / 2
                const aMax = Math.max(distA, distB)
                pointPairs.push({
                    pi: [points[hp], points[hp + 1]],
                    pj: [points[hc], points[hc + 1]],
                    min: {
                        alpha: aMin,
                        cx: (points[hp] + points[hc]) / 2,
                        cy: (points[hp + 1] + points[hc + 1]) / 2
                    },
                    max: {
                        alpha: aMax,
                        cx: distA == aMax ? x : p[0],
                        cy: distA == aMax ? y : p[1]
                    }
                })
            } else {
                const aMin = Math.min(distA, distB)
                const aMax = Math.max(distA, distB)
                pointPairs.push({
                    pi: [points[hp], points[hp + 1]],
                    pj: [points[hc], points[hc + 1]],
                    min: {
                        alpha: aMin,
                        cx: distA == aMin ? x : p[0],
                        cy: distA == aMin ? y : p[1]
                    },
                    max: {
                        alpha: aMax,
                        cx: distA == aMax ? x : p[0],
                        cy: distA == aMax ? y : p[1]
                    }
                })
            }
        }
    }
    return pointPairs;
}

// returns true if the line from (a,b)->(c,d) intersects with (p,q)->(r,s)
// From: https://stackoverflow.com/a/24392281
function intersects(a, b, c, d, p, q, r, s) {
    var det, gamma, lambda;
    det = (c - a) * (s - q) - (r - p) * (d - b);
    if (det === 0) {
        return false;
    } else {
        lambda = ((s - q) * (r - a) + (p - r) * (s - b)) / det;
        gamma = ((b - d) * (r - a) + (c - a) * (s - b)) / det;
        return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
    }
}

function dist(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}

function showAlphaBounds(point) {
    ab.append('circle')
        .attr('r', point.max.alpha)
        .attr('cx', point.max.cx)
        .attr('cy', point.max.cy)
        .attr('fill', 'none')
        .attr('stroke', 'green')
        .attr('stroke-dasharray', 5)
    ab.append('circle')
        .attr('r', point.min.alpha)
        .attr('cx', point.min.cx)
        .attr('cy', point.min.cy)
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-dasharray', 5)
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