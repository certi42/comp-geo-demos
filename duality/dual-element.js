class DualElement {
    constructor(x, y, primalPlane, dualPlane) {
        this.color = randomColor({ luminosity: 'bright' });
        const circle = primalPlane
            .append("circle")
            .attr('cx', x)
            .attr('cy', y)
            .attr('r', 5)
            .attr('fill', this.color)
        this.plane = primalPlane;
        this.point = new DualPoint(circle.node(), this);
        this.line = new DualLine(dualPlane.append("line").attr('stroke', this.color), this);
        this.line.updatePosition(this.point.x, this.point.y);

    }

    remove() {
        this.point.remove();
        this.line.remove();
        this.plane.removeDraggable(this);
    }

    move(e) {
        this.point.move(e);
        this.line.move(e);
    }

    updatePosition(x, y) {
        this.point.updatePosition(x, y);
        this.line.updatePosition(x, y);
    }
}

let shift = false;
window.addEventListener("keydown", (e) => {
    if (e.key === "Shift") {
        shift = true;
    }
});
window.addEventListener("keyup", (e) => {
    if (e.key === "Shift") {
        shift = false;
    }
});