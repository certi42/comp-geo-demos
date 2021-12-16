class Draggable {
    /**
     * @param {SVGCircleElement} el 
     */
    constructor(el) {
        this.el = el;
        this.parent = parent
        this.moving = false;
        this.offsetX = 0;
        this.offsetY = 0;
        this.x = this.el.cx.baseVal.value;
        this.y = this.el.cy.baseVal.value;
        this.color = randomColor();

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
            this.remove();
            e.preventDefault();
        };
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
        computeVoronoiDiagram();
    }

    position() {
        return [this.x, this.y]
    }

    remove() {
        this.el.remove();
        removeDraggable(this);
    }
}