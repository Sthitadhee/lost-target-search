let mapSizeX = 40;
let mapSizeY = 40;
let meanX = 10;
let meanY = 10;
let covariance = 2;
let speed = 1000; // fast
let algo = 'MPSO';
let uavFlightSteps = 20;
let uavPositionX = 0; //centre
let uavPositionY = 0;
let currentMap = []

let path = [];
let targetPosition = [meanY, meanX]; // same as mean

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
    currentMap
}