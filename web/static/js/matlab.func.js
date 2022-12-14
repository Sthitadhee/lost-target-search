// all the functions from matlab to js

import {
    calcSum,
    fixPrecisionIn2D,
    normaliseMatrix,
    arrayAlreadyHasArray,
    elementWiseMultiplication,
    delay,
    _clone,
    roundToNDecPlaces
} from './helper.js';
import { createPath, redrawMap } from './map.js';
import Store from './variable.js'

/* 
    creates a random sequence of positions in motion space of length N
    @param {object} model
    @return {array}
*/
export function CreateRandomSolution(model) {
    const N = model.n;
    const startNode = [model.xs, model.ys]
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

        for (let iter = 0; iter < N; iter++) {
            path.push(startNode)
        }

        let currentNode = startNode;
        for (let iter = 0; iter < N; iter++) {
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

/* converts position to path ~ (-)0.7071 converts to (-)1 
    @param {2d array} motion
    @return {1d array} 
*/
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

/* 
    calculates the cost or cumulative probabilities using the cost function 
    @param {array} position
    @param {object} model
    @return {number} the cost probability
*/
export async function myCost(position, model) {
    if (!checkMotion(position, model)) {
        Store.path = [];
        redrawMap(true);
        return 0;
    }
    else {
        let Pmap = _clone(model.map);
        let scaleFactor, pNoDetection;
        let pDetection = [];
        const N = model.n;
        let pNoDetectionAtAll = 1.0000;
        let path = PathFromMotion(position, model);
        let location = {};
        for (let i = 0; i < N; i++) {
            location.x = path[i][0] + model.xmax + 1;
            location.y = path[i][1] + model.ymax + 1;
            [scaleFactor, Pmap] = UpdateMap(i + 1, model, location, Pmap);
            Store.currentMap = _clone(Pmap)
            redrawMap();
            await delay(Store.speed)
            pNoDetection = scaleFactor;
            pDetection[i] = pNoDetectionAtAll * roundToNDecPlaces(1.00000 - pNoDetection); //check
            pNoDetectionAtAll *= pNoDetection;
            pNoDetectionAtAll = roundToNDecPlaces(pNoDetectionAtAll);
            if(!Store.resultMap.length && i === N-1) {
                Store.resultMap = _clone(Pmap);
            }
        }
        return roundToNDecPlaces(1.00000 - pNoDetectionAtAll);
    }

}

/* 
    checks if the new motion of UAV is valid within the map
    @param {array} position
    @param {object} model
    @return {boolean}
*/
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
    // const withoutDuplicates = Array.from(new Set(path.map(JSON.stringify)), JSON.parse);
    // if (path.length != withoutDuplicates.length) {
    //     valid = false;
    // }
    return valid
}

/* 
    converts motion space to cartesian space
    @param {array} position
    @param {object} model
    @return {array}
*/
export function PathFromMotion(position, model) {
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
    createPath('maxMap', path)
    return path;
}

/* 
    updates the map by creating a new path and new target position
    @param {number} index
    @param {object} model
    @param {array} location
    @param {array} map
    @return {array}
*/
function UpdateMap(index, model, location, map) {
    const MAPSIZE_X = model.MAPSIZE_X;
    const MAPSIZE_Y = model.MAPSIZE_Y;
    const direction = model.targetDir;
    const targetSteps = model.targetSteps;
    const pathlength = model.n;

    const move = DirToMove(direction);
    if (targetSteps !== 0) {
        const moveStep = Math.round(pathlength / targetSteps);
        if (index % moveStep === 0) {
            const tmp = noncircshift(_clone(map), move);
            map = tmp;
        }
    }
    let pSensorNoDetection = new Array(MAPSIZE_Y);
    for (let i = 0; i < MAPSIZE_Y; i++) {
        pSensorNoDetection[i] = new Array(MAPSIZE_X).fill(1.00000);
    }
    pSensorNoDetection[location.y][location.x] = 0.00000;
    const mulMap = elementWiseMultiplication(pSensorNoDetection, map);
    map = fixPrecisionIn2D(mulMap)
    const scaleFactor = calcSum(map);
    const newMap = normaliseMatrix(map, scaleFactor, Store.targetPosition);
    return [scaleFactor, newMap];
}

/* 
    converts string direction notation to mathematical values for movement in map
    @param {string} direction
    @return {array}
*/
export function DirToMove(direction) {
    let move;
    switch (direction) {
        case 'N':
            move = [1, 0];
            break;
        case 'NE':
            move = [1, 1];
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
        default:
            move = [0, 1];
            break;
    }
    return move;
}

/* 
    responsible for movement of target 
    @param {array} map
    @param {array} movement
    @return {array}
*/
function noncircshift(map, movement) {
    if (movement[0] > 0) {
        for (let i = 0; i < movement[0]; i++) {
            shiftDown(map);
            Store.targetPosition[0] = Store.targetPosition[0] + 1; // because of inverse drawing of map
        }
    }
    if (movement[0] < 0) {
        for (let i = 0; i < Math.abs(movement[0]); i++) {
            shiftUp(map);
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
        for (let i = 0; i < Math.abs(movement[1]); i++) {
            shiftLeft(map);
            Store.targetPosition[1] = Store.targetPosition[1] - 1;
        }
    }
    return map;
}

/* 
    For moving target up
    @param {array}
*/
function shiftUp(map) {
    map.shift();
    map.push(new Array(map[0].length).fill(0));
}

/* 
    For moving target down
    @param {array}
*/
function shiftDown(map) {
    map.pop()
    map.unshift(new Array(map[0].length).fill(0))
}

/* 
    For moving target right
    @param {array}
*/
function shiftRight(map) {
    map.forEach(item => {
        item.pop()
        item.unshift(0)
    })
}

/* 
    For moving target left
    @param {array}
*/
function shiftLeft(map) {
    map.forEach(item => {
        item.shift()
        item.push(0)
    })
}