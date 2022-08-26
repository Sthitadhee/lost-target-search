export function CreateRandomSolution() {
    let n = model.n;
    let startNode = [model.xs, model.ys]
    let path = []; //check this
    maxIterations = 100;

    motions = [
        [1, 0],
        [0.7071, 0.7071],
        [0, 1],
        [-0.7071, 0.7071],
        [-1, 0],
        [-0.7071, -0.7071],
        [0, -1],
        [0.7071, -0.7071],
    ]

    let shouldStart = true;

    while (shouldStart) {
        shouldStart = false;

        for (let iter = 0; iter < n; iter++) {
            path.push(startNode)
        }

        let position = [];
        currentNode = startNode;
        for (let iter = 0; iter < n; iter++) {
            let randomIndex = Math.floor(Math.random() * motions.length); //check const or let
            let motion = motions[randomIndex];
            let invalidFlag = true;
            let iteration = 0;

            while (invalidFlag && it < maxIterations) {
                // motion is in motion space, nextMove is in cartesian space
                const nextMove = MotionDecode(motion); // check const
                const nextNode = currentNode + nextMove; // need tf probably or smth else (check) // check const
                invalidFlag = false;

                if (nextNode[1] > model.xmax) {
                    motion = motion[1];
                    invalidFlag = true;
                    iteration += 1;
                }
                else if (nextNode[1] < model.xmin) {
                    motion = motion[0];
                    invalidFlag = true;
                    iteration += 1;
                }
                else if (nextNode[2] > ymax) {
                    motion = motion[6];
                    invalidFlag = true;
                    iteration += 1;
                }
                else if (nextNode[2] < ymin) {
                    motion = motion[2];
                    invalidFlag = true;
                    iteration += 1;
                }
                else if (path.includes(nextNode)) {
                    randomIndex = Math.floor(Math.random() * motions.length); //check const or let
                    motion = motions[randomIndex];
                    invalidFlag = true;
                    iteration += 1;
                }
            }

            if (iteration >= maxIterations) {
                shouldStart = true;
                break;
            }
            else {
                path[iter] = nextNode;
                currentNode = nextNode;
                position[iter] = motion;
            }
        }
        return position;
    }
}


export function MotionDecode(motion) {
    const angle = Math.atan2(motion[2], motion[1]);
    const rounded = round(8 * angle / (2 * Math.PI) + 8);
    const octant = rounded % 8 + 1;
    moveArray = [
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [-1, -1],
        [0, -1],
        [1, -1]
    ];
    return moveArray[octant];
}

export function myCost(position, model) {

    if(checkMotion(position, model)) {
        return 0;
    }
    else {
        let Pmap = model.map;
        let scaleFactor, pNoDetection;
        let pDetection = [];
        const N = model.n;
        let pNoDetectionAtAll = 1;
        let path = PathFromMotion(position, model);
        let location = {};
        for(let i=0; i < N; i++) {
            location.x = path[i][0] + model.xmax + 1;
            location.y = path[i][1] + model.ymax + 1;

            [ scaleFactor, Pmap ] = UpdateMap(i, model, location);
            pNoDetection = scaleFactor;
            pDetection[i] = pNoDetectionAtAll * (1 - pNoDetection);
            pNoDetectionAtAll *= pNoDetection;
        }
        return 1 - pNoDetectionAtAll;
    }

}


// check if this is neeeded
function checkMotion(position, model) {
    const N = model.n;
    const xs = model.xs;
    const ys = model.ys;
    let path = [];
    let currentNode = [xs, ys];
    let valid = true;

    for(let i=0; i<N; i++) {
        const motion = path[i];
        const nextMove = MotionDecode(motion);
        const nextNode = currentNode + nextMove;
        if(nextNode[1] > model.xmax || nextNode[1] < model.xmin || nextNode[2] > model.ymax || nextNode[2] < model.ymin) {
            valid = false;
            return valid;
        }
        path[i] = nextNode;
        currentNode = nextNode;
    }

    const withoutDuplicates = Array.from(new Set(path));
    if(path.length != withoutDuplicates.length) {
        valid = false;
    }
    return valid
}

function PathFromMotion(position, model) {
    const N = model.n;
    const xs = model.xs;
    const ys = model.ys;
    let path = [];
    let currentNode = [xs, ys];
    for(let i=0; i<N; i++) {
        const motion = position[i];
        const nextMove = MotionDecode(motion);
        let nextNode = currentNode + nextMove;

        if(nextNode[1] > xmax) {
            nextNode = model.xmax;
        } else if (nextNode[1] < xmin){
            nextNode = model.xmin;
        }
        if(nextNode[2] > ymax) {
            nextNode = model.ymax;
        } else if (nextNode[2] < ymin){
            nextNode = model.ymin;
        }

        path[i] = currentNode;
        currentNode = nextNode;
    }
    return path;
}

function UpdateMap(index, model, location) {
    const MAPSIZE_X = model.MAPSIZE_X;
    const MAPSIZE_Y = model.MAPSIZE_Y;
    const direction = model.targetDir;
    const targetSteps = model.targetSteps;
    const pathlength = model.n;
    let map = model.map;

    const move = DirToMove(direction);

    if(targetSteps !== 0) {
        const moveStep = Math.round(pathlength/targetSteps);
        if(index % moveStep === 0) {
            const tmpMap = noncircshift(map, move)
            map = tmpMap / Math.sum(tmpMap); // check this
        } 
    }

    let pSensorNoDetection = new Array(MAPSIZE_Y).fill( new Array(MAPSIZE_X).fill(1));
    pSensorNoDetection[ys][xs] = 0;
    let newMap = pSensorNoDetection * map; //element wise multiply (check)
    const scaleFactor = Math.sum(newMap); // tf sum  check 
    newMap = newMap/ scaleFactor; // check
    return [scaleFactor, newMap] // check 
}

function DirToMove(direction) {
    let move;
    switch(direction) {
        case 'N':
            move = [1, 0];
        case 'NE':
            move = [1, 1];
        case 'E':
            move = [0, 1];
        case 'SE':
            move = [-1, 1];
        case 'S':
            move = [-1, 0];
        case 'SW':
            move = [-1, -1];
        case 'W':
            move = [0, -1];
        case 'NW':
            move = [1, -1];
    }
    return move;
}

function noncircshift(map, movement) {
    if(movement[0] > 0) {
        for(let i=0; i<movement[0]; i++) {
            shiftUp(map)
        }
    }
    if(movement[0] < 0) {
        for(let i=0; i<movement[0]; i++) {
            shiftDown(map)
        }
    }
    if(movement[1] > 0) {
        for(let i=0; i<movement[0]; i++) {
            shiftRight(map)
        }
    }
    if(movement[1] < 0) {
        for(let i=0; i<movement[0]; i++) {
            shiftLeft(map)
        }
    }
}

function shiftUp(map) {
    map.shift();
    map.push(new Array(map[0].length).fill(0))
}

function shiftDown(map) {
    map.pop()
    map.unshift(new Array(map[0].length).fill(0))
}

function shiftRight(map) {
    map.forEach(item => {
        item.pop()
        item.unshift(0)
    })
}

function shiftLeft(map) {
    map.forEach(item => {
        item.shift()
        item.push(0)
    })
}