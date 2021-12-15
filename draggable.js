class Draggable {
    /**
     * @param {SVGCircleElement} el 
     */
    constructor(el) {
        this.el = el;
        this.moving = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.x = this.el.cx.baseVal.value;
        this.y = this.el.cy.baseVal.value;

        this.el.onmousedown = (e) => {
            this.startMoving(e.clientX, e.clientY);
            e.stopPropagation();
        };

        this.el.onmouseup = (e) => {
            if (this.moving) {
                this.stopMoving(e.clientX, e.clientY);
            }
        };

        this.el.oncontextmenu = (e) => {
            this.el.remove();
            this.line.remove();
            removeDraggable(this);
            e.preventDefault();
        };
        this.line = dualSvg.append("line")
        this.updateLine();
    }

    /**
     * @param {MouseEvent} e 
     * @returns 
     */
    move(e) {
        if (this.moving === false) {
            return;
        }
        this.updatePosition(e.clientX - this.offsetX, e.clientY - this.offsetY);
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    startMoving(x, y) {
        this.offsetX = x - this.x;
        this.offsetY = y - this.y;
        this.moving = true;
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    stopMoving(x, y) {
        this.moving = false;
        this.x = x - this.offsetX;
        this.y = y - this.offsetY;
    }

    updatePosition(x, y) {
        this.x = x;
        this.y = y;
        this.el.setAttribute("cx", x.toString());
        this.el.setAttribute("cy", y.toString());
        this.updateLine();
    }

    updateLine() {
        const xScale = d3.scaleLinear().domain([0, 500]).range([-5, 5]);
        const yScale = d3.scaleLinear().domain([0, 500]).range([5, -5]);
        const a = xScale(this.x);
        const b = yScale(this.y);
        this.line
            .attr("x1", xScale.invert(-5))
            .attr("x2", xScale.invert(5))
            .attr("y1", yScale.invert(a * -5 - b))
            .attr("y2", yScale.invert(a * 5 - b))
            .attr("stroke", "black")
    }
}