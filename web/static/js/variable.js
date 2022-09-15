let mapSizeX = 40;
let mapSizeY = 40;
let meanX = 10;
let meanY = 10;
let covariance = 2;
let speed = 0; // fast
let algo = 'MPSO';
let uavFlightSteps = 20;
let uavPositionX = 0; //centre
let uavPositionY = 0;
let currentMap = [];
let targetDir = 'E';

let path = [];
let targetPosition = [meanY - 1, meanX - 1]; // same as mean

let pathSmMap = [];

let currentCost = 'Unknown';
let currentStatus = 'Press VISUALIZE to start search!';
let currentPBest = -1;
let currentGBest = 'Unknown';
let nParticles = 50;
let isRandomInitialisation = true;
let currentMPSOindex = 0;
let noMpsoRepeat = 3;
let currentMpsoRepeatIndex = 0;

let resultMap = []

export default {
    path,
    mapSizeX,
    mapSizeY,
    meanX,
    meanY,
    covariance,
    speed,
    algo,
    uavFlightSteps,
    uavPositionX,
    uavPositionY,
    targetPosition,
    currentMap,
    pathSmMap,
    currentCost,
    currentGBest,
    currentPBest,
    isRandomInitialisation,
    currentStatus,
    nParticles,
    currentMPSOindex,
    noMpsoRepeat,
    currentMpsoRepeatIndex,
    targetDir,
    resultMap
}