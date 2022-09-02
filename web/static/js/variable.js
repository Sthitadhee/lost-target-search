let mapSizeX = 40;
let mapSizeY = 40;
let mean = 3;
let covariance = 2;
let speed = 1000;
let algo = 'MPSO';
let uavFlightSteps = 20;
let uavPositionX = 0;
let uavPositionY = 0;

let path = [];
let targetPosition = [mean, mean]; // same as mean

export default {
    path,
    mapSizeX,
    mapSizeY,
    mean,
    covariance,
    speed,
    algo,
    uavFlightSteps,
    uavPositionX,
    uavPositionY,
    targetPosition
}