export default class Model {
    constructor(MAPSIZE_X, MAPSIZE_Y) {
        this.xs = 0, // initial uav position 
        this.ys = 0, // initial uav position 
        this.mrange = 4
        this.n = 20
        this.xmin = -Math.floor(MAPSIZE_X / 2)
        this.xmax = Math.floor(MAPSIZE_X / 2)
        this.ymin = -Math.floor(MAPSIZE_Y / 2)
        this.ymax = Math.floor(MAPSIZE_Y / 2)
        this.X = 0
        this.Y = 0
        this.targetDir = 'E'
        this.targetSteps = 10
        this.map = []
        this.MAPSIZE_X = MAPSIZE_X
        this.MAPSIZE_Y = MAPSIZE_Y
    }
}