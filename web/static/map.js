export default class Map {

    constructor(tileSize, model) {
        this.tileSize = tileSize;
        this.model = model;
    }

    drawMap() {

    }

    draw() {
        // console.log('draw');
    }

    setCanvasSize(canvas) {
        canvas.width = this.map[0].length * this.tileSize;
        canvas.height = this.map.length * this.tileSize;
    }

}