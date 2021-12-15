draggables = []

class DualPlane {
    constructor(primalId, dualId) {
        this.el = d3.select(primalId);
        this.dual = d3.select(dualId);

        this.el.on('mousedown', (e) => {
            const dual = new DualElement(e.layerX, e.layerY, this, this.dual);
            dual.point.startMoving(e.clientX, e.clientY);
            draggables.push(dual);
        })

        this.el.on('mousemove', (e) => {
            draggables.forEach(d => d.move(e));
        })
    }

    append(nodeType) {
        return this.el.append(nodeType);
    }

    removeDraggable(obj) {
        draggables.splice(draggables.indexOf(obj), 1);
    }
}

function resetDraggables() {
    for (let i = draggables.length - 1; i >= 0; i--) {
        draggables[i].remove()
    }
}