import Map from './map.js'

const tileSize = 32;
const MAPSIZE = 40
const model = {
    xs: 0, // initial uav position x
    ys: 0, // initial uav position x
    mrange: 4,
    n: 20,
    xmin: -Math.floor(MAPSIZE / 2),
    xmax: Math.floor(MAPSIZE / 2),
    ymin: -Math.floor(MAPSIZE / 2),
    ymax: Math.floor(MAPSIZE / 2),
    X: 0,
    Y: 0,
    map: [],
}
const canvas = document.getElementById("simulationCanvas");
const ctx = canvas.getContext('2d');
const map = new Map(tileSize, model);

function simulationLoop() {
    // console.log('simulate')
}

map.setCanvasSize(canvas)
setInterval(simulationLoop, 1000 / 75)

// Map limits
// xmin= -floor(MAP_SIZE/2);
// xmax= floor(MAP_SIZE/2);

// ymin= -floor(MAP_SIZE/2);
// ymax= floor(MAP_SIZE/2);

// % Initial searching position % and also the position of the uav
// xs=0;
// ys=0;

// % Number of path nodes (including the start position (start node))
// n=20; % UAV flight steps

// % Motion range
// MRANGE = 4;

// %% Incorporate the map and search parameters into a model
// model.xs=xs; % position of the uav
// model.ys=ys; % position of the uav
// model.Pmap=Pmap; % map matrix with probabilities
// model.n=n; % UAV flight steps
// model.xmin=xmin; % (0 - Map_size in x direction)/2
// model.xmax=xmax; % (Map_size in x direction - 0)/2
// model.ymin=ymin;
// model.ymax=ymax;
// model.MRANGE = MRANGE; % for velocity and position bounds
// model.MAPSIZE = MAP_SIZE;
// model.X = X; % position of target in x direction
// model.Y = Y; % position of target in y direction
// % number of steps target takes
// % Must be divisible by the path length (e.g, mod(N,move)=0) 
// % Above comment is void if round is used in UpdateMap
// % ex - moveStep = round(pathLength/totalMoves); 
// model.targetMoves = 10; 
// model.targetDir = 'E';  % The target moves in East direction