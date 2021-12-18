class DualLine {
    /**
     * @param {d3.Selection<SVGLineElement, any, HTMLElement, any>} el 
     * @param {DualElement} parent
     */
    constructor(el, parent) {
        this.el = el;
        this.moving = false;
        this.parent = parent;

        this.el.on("mousedown", (e) => {
            this.startMoving();
            e.stopPropagation();
        });
        this.el.on("mouseup", (e) => {
            if (this.moving) {
                this.stopMoving();
            }
        });
        this.el.on("contextmenu", (e) => {
            this.parent.remove();
            e.preventDefault();
        });
    }

    /**
     * @param {MouseEvent} e 
     * @returns 
     */
    move(e) {
        if (this.moving === false) {
            return;
        }

        const xScale = d3.scaleLinear().domain([0, 500]).range([-5, 5]);
        const yScale = d3.scaleLinear().domain([0, 500]).range([5, -5]);
        const rect = this.parent.dualBounds();
        const x = xScale(e.clientX - rect.left);
        const y = yScale(e.clientY - rect.top);
        if (shift) {
            // goal: change a such that line intersects with (x, y)
            // solve y = ax - b => a = (y + b) / x
            const a = (y + this.b) / x;
            if (x !== 0) {
                this.parent.updatePosition(xScale.invert(a), yScale.invert(this.b));
            }
        } else {
            // goal: change b such that line intersects with (x, y)
            // solve y = ax - b => b = ax - y
            const b = this.a * x - y;
            this.parent.updatePosition(xScale.invert(this.a), yScale.invert(b));
        }
    }

    startMoving() {
        this.moving = true;
    }

    stopMoving() {
        this.moving = false;
    }

    updatePosition(x, y) {

        const xScale = d3.scaleLinear().domain([0, 500]).range([-5, 5]);
        const yScale = d3.scaleLinear().domain([0, 500]).range([5, -5]);
        const a = xScale(x);
        const b = yScale(y);
        this.a = a;
        this.b = b;
        this.el
            .attr("x1", xScale.invert(-5))
            .attr("x2", xScale.invert(5))
            .attr("y1", yScale.invert(a * -5 - b))
            .attr("y2", yScale.invert(a * 5 - b))
    }

    remove() {
        this.el.remove();
    }
}