function loadDemo(name) {
    resetDraggables();
    d3.json("demos/" + name + ".json").then(data => {
        alpha = data.alpha;
        alphaInput.value = alpha;
        data.points.forEach(point => {
            addDraggable(point[0], point[1], false)
        });
        computeAlphaHull();
    });

}