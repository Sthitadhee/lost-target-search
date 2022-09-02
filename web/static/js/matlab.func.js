import { calcSum, fixPrecisionIn2D, normaliseMatrix, arrayAlreadyHasArray, delay } from './helper.js';
import Store from './variable.js'

export function CreateRandomSolution(model) {
    let n = model.n;
    let startNode = [model.xs, model.ys]
    let path = []; //check this
    const maxIterations = 100;

    const motions = [
        [1, 0], // north
        [0.7071, 0.7071],
        [0, 1],
        [-0.7071, 0.7071],
        [-1, 0],
        [-0.7071, -0.7071],
        [0, -1],
        [0.7071, -0.7071],
    ]

    let shouldStart = true;
    let position = [];

    while (shouldStart) {
        shouldStart = false;

        for (let iter = 0; iter < n; iter++) {
            path.push(startNode)
        }

        let currentNode = startNode;
        for (let iter = 0; iter < n; iter++) {
            let randomIndex = Math.floor(Math.random() * motions.length); //check const or let
            let motion = motions[randomIndex];
            let invalidFlag = true;
            let iteration = 0;
            let nextNode;

            while (invalidFlag && iteration < maxIterations) {
                // motion is in motion space, nextMove is in cartesian space
                let nextMove = MotionDecode(motion); // check const
                let tensorAdd = tf.add(tf.tensor(currentNode), tf.tensor(nextMove)) // element wise addition
                nextNode = Array.from(tensorAdd.dataSync());
                invalidFlag = false;

                if (nextNode[1] > model.xmax) {
                    motion = motion[4];
                    invalidFlag = true;
                    iteration += 1;
                }
                else if (nextNode[1] < model.xmin) {
                    motion = motion[0];
                    invalidFlag = true;
                    iteration += 1;
                }
                else if (nextNode[2] > model.ymax) {
                    motion = motion[6];
                    invalidFlag = true;
                    iteration += 1;
                }
                else if (nextNode[2] < model.ymin) {
                    motion = motion[2];
                    invalidFlag = true;
                    iteration += 1;
                }
                else if (arrayAlreadyHasArray(path, nextNode)) {
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
    }
    return position;
}

// converts position to path. quite weird because only (-)0.7071 converts to (-)1 for instance and everything else remains exactly same
export function MotionDecode(motion) {
    const angle = Math.atan2(motion[1], motion[0]);
    const rounded = Math.round(8 * angle / (2 * Math.PI) + 8);
    const octant = rounded % 8;
    const moveArray = [
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

export async function myCost(position, model, mapObj) {

    if (!checkMotion(position, model)) {
        return 0;
    }
    else {
        let Pmap = JSON.parse(JSON.stringify(model.map));
        let scaleFactor, pNoDetection;
        let pDetection = [];
        const N = model.n;
        let pNoDetectionAtAll = 1;
        let path = PathFromMotion(position, model, mapObj);
        let location = {};
        for (let i = 0; i < N; i++) {
            location.x = path[i][0] + model.xmax + 1;
            location.y = path[i][1] + model.ymax + 1;

            [scaleFactor, Pmap] = UpdateMap(i, model, location, Pmap);
            await delay(200)
            mapObj.redrawMap(Pmap, model.xs, model.ys);
            pNoDetection = scaleFactor;
            // continue
            pDetection[i] = pNoDetectionAtAll * (1 - pNoDetection);
            pNoDetectionAtAll *= pNoDetection;
        }
        return 1 - pNoDetectionAtAll;
    }

}


function checkMotion(position, model) {
    const N = model.n;
    const xs = model.xs;
    const ys = model.ys;
    let path = [];
    let currentNode = [xs, ys];
    let valid = true;

    for (let i = 0; i < N; i++) {
        const motion = position[i];
        const nextMove = MotionDecode(motion);
        const tensorAdd = tf.add(tf.tensor(currentNode), tf.tensor(nextMove)) // element wise addition
        const nextNode = Array.from(tensorAdd.dataSync());
        if (nextNode[1] > model.xmax || nextNode[1] < model.xmin || nextNode[2] > model.ymax || nextNode[2] < model.ymin) {
            valid = false;
            return valid;
        }
        path[i] = nextNode;
        currentNode = nextNode;
    }

    const withoutDuplicates = Array.from(new Set(path));
    if (path.length != withoutDuplicates.length) {
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
    for (let i = 0; i < N; i++) {
        const motion = position[i];
        const nextMove = MotionDecode(motion);
        const tensorAdd = tf.add(tf.tensor(currentNode), tf.tensor(nextMove)) // element wise addition
        let nextNode = Array.from(tensorAdd.dataSync());

        if (nextNode[1] > model.xmax) {
            nextNode = model.xmax;
        } else if (nextNode[1] < model.xmin) {
            nextNode = model.xmin;
        }
        if (nextNode[2] > model.ymax) {
            nextNode = model.ymax;
        } else if (nextNode[2] < model.ymin) {
            nextNode = model.ymin;
        }

        path[i] = currentNode;
        currentNode = nextNode;
    }
    Store.path = [];
    for (let p = 0; p < path.length; p++) {
        Store.path.push(`${path[p][0]},${path[p][1]}`)
    }
    return path;
}

function UpdateMap(index, model, location, map) {
    const MAPSIZE_X = model.MAPSIZE_X;
    const MAPSIZE_Y = model.MAPSIZE_Y;
    const direction = model.targetDir;
    const targetSteps = model.targetSteps;
    const pathlength = model.n;

    const move = DirToMove(direction);
    if (targetSteps !== 0) {
        const moveStep = Math.round(pathlength / targetSteps);
        if ((index+1) % moveStep === 0) {
            const tmp = noncircshift(JSON.parse(JSON.stringify(map)), move);
            map = tmp;
        }
    }
    let pSensorNoDetection = new Array(MAPSIZE_Y).fill(new Array(MAPSIZE_X).fill(1));
    pSensorNoDetection[location.y][location.x] = 0;
    const tensorPsensorNoDetection = tf.tensor(pSensorNoDetection);
    let tensorNewMap = tf.mul(tensorPsensorNoDetection, tf.tensor(map));
    map = fixPrecisionIn2D(Array.from(tensorNewMap.arraySync()))
    const scaleFactor = calcSum(map);
    const newMap = normaliseMatrix(map, scaleFactor, Store.targetPosition);
    return [scaleFactor, newMap];
}

export function DirToMove(direction) {
    let move;
    switch (direction) {
        case 'N':
            move = [1, 0];
            break;
        case 'NE':
            move = [1, 1];
            break;
        case 'E':
            move = [0, 1];
            break;
        case 'SE':
            move = [-1, 1];
            break;
        case 'S':
            move = [-1, 0];
            break;
        case 'SW':
            move = [-1, -1];
            break;
        case 'W':
            move = [0, -1];
            break;
        case 'NW':
            move = [1, -1];
            break;
    }
    return move;
}

function noncircshift(map, movement, target) {
    if (movement[0] > 0) {
        for (let i = 0; i < movement[0]; i++) {
            shiftUp(map);
            Store.targetPosition[0] = Store.targetPosition[0] + 1;
        }
    }
    if (movement[0] < 0) {
        for (let i = 0; i < movement[0]; i++) {
            shiftDown(map);
            Store.targetPosition[0] = Store.targetPosition[0] - 1;
        }
    }
    if (movement[1] > 0) {
        for (let i = 0; i < movement[1]; i++) {
            shiftRight(map);
            Store.targetPosition[1] = Store.targetPosition[1] + 1;
        }
    }
    if (movement[1] < 0) {
        for (let i = 0; i < movement[1]; i++) {
            shiftLeft(map);
            Store.targetPosition[1] = Store.targetPosition[1] - 1;
        }
    }
    return map;
}

function shiftUp(map) {
    map.shift();
    map.push(new Array(map[0].length).fill(0));
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