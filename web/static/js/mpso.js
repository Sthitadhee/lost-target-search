// the mpso function engine

import { CreateRandomSolution, myCost, PathFromMotion } from './matlab.func.js';
import Store from './variable.js'
import { delay, elementWiseAddition, elementWiseMultiplication, elementWiseMultiplicationWithConstant, elementWiseSubtraction, fixPrecisionIn2D, getMax, _clone } from './helper.js';
import { drawSideMap, redrawMap, createPath, drawSideInfo } from './map.js';


/* 
    runs the mpso algorithm
    @param {object} model
    @param {event object} e
*/
export async function runMpso(model, e) {
    // ----- set all the parameters -----

    // PSO algo parameters
    const maxIteration = Store.noMpsoRepeat; // 100
    Store.noMpsoRepeat = maxIteration;
    const particlePopulation = Store.nParticles; //1000
    let w = 1;
    const wDamp = 0.98;
    const c1 = 2.5;
    const c2 = 2.5;

    //pso uav parameters
    // const nFlightSteps = model.n;
    const randGeneratingMatrix = [model.n, 2] // not sure how it will work

    // pso boundary parameters
    // const maxPosition = model.mrange;
    // const minPosition = -model.mrange;
    // const alpha = 2;
    // const maxVelocity = alpha * (maxPosition - minPosition);
    // const minVelocity = -maxVelocity;

    // ----- create particle obj -----
    let particles = {};
    let GlobalBest = {};
    GlobalBest.cost = -1;

    // do the random initialisation loop
    Store.nParticles = particlePopulation;
    Store.currentStatus = 'Initialising Particles Randomly'
    Store.currentMPSOindex = 1;
    drawSideInfo();
    await delay(1500);
    for (let i = 1; i < particlePopulation + 1; i++) {
        Store.currentMPSOindex = i;
        await delay(500);
        drawSideInfo();
        // draw the current global best
        drawSideMap(GlobalBest.cost);
        Store.targetPosition = [Store.meanY - 1, Store.meanX - 1]; // restore target position for every particle start

        let velocity = new Array(randGeneratingMatrix[0]);
        for (let j = 0; j < randGeneratingMatrix[0]; j++) {
            velocity[j] = new Array(randGeneratingMatrix[1]).fill(0.00000);
        }
        const position = CreateRandomSolution(model);
        const costP = await myCost(position, model)
        Store.currentCost = costP;
        Store.currentPBest = costP;
        particles[i - 1] = {
            velocity,
            position,
            cost: costP,
            bestCost: costP,
            bestPosition: _clone(position)
        };
        if (particles[i - 1].bestCost > GlobalBest.cost) {
            GlobalBest = {
                cost: particles[i - 1].bestCost,
                position: _clone(particles[i - 1].bestPosition)
            };
        }
        Store.currentGBest = GlobalBest.cost;
        createMiniMap(GlobalBest.position, model);
        drawSideMap(GlobalBest.cost);
    }
    Store.currentStatus = 'Random Best particle path';
    drawSideInfo();
    createFinalMap(GlobalBest.position, model);
    redrawMap();
    await delay(5000);

    let BestCost = []

    // MPSO loop
    Store.currentMPSOindex = 1;
    Store.isRandomInitialisation = false;
    Store.currentStatus = 'Optimal Search Path using MPSO';
    drawSideInfo()
    await delay(1500)
    for (let it = 0; it < maxIteration; it++) {
        Store.currentMpsoRepeatIndex = it;

        for (let i = 0; i < particlePopulation; i++) {
            Store.currentMPSOindex = i + 1;
            await delay(500);
            drawSideInfo();
            Store.targetPosition = [Store.meanY - 1, Store.meanX - 1];

            particles[i].velocity = calculatedMpsoUpdatedVelocity(w, c1, c2, particles[i], randGeneratingMatrix, GlobalBest); //check
            particles[i].position = elementWiseAddition(particles[i].position, particles[i].velocity);
            const costP = await myCost(particles[i].position, model)
            particles[i].cost = costP;
            Store.currentCost = costP;
            if (particles[i].cost > particles[i].bestCost) {
                particles[i].bestCost = particles[i].cost;
                particles[i].bestPosition = _clone(particles[i].position);

                if (particles[i].bestCost > GlobalBest.cost) {
                    GlobalBest = {
                        cost: particles[i].bestCost,
                        position: _clone(particles[i].bestPosition)
                    };
                }
            }
            Store.currentGBest = GlobalBest.cost;
            drawSideInfo();
            createMiniMap(GlobalBest.position, model);
            drawSideMap(GlobalBest.cost);
        }

        BestCost[it] = {
            cost: GlobalBest.cost,
            position: GlobalBest.position
        };
        w = w * wDamp;
    }
    // Get the results
    Store.currentStatus = 'Best particle path using MPSO'
    drawSideInfo();
    createFinalMap(GlobalBest.position, model);
    await delay(1000);
    redrawMap(true);

    e.target.disabled = false;
    e.target.classList.remove('bg-success');
}

/* 
    calculates the update velocity of Mpso
    @param {number} w
    @param {number} c1
    @param {number} c2
    @param {object} particle
    @param {array} rMatrix
    @param {object} GlobalBest
    @return {number}
*/
function calculatedMpsoUpdatedVelocity(w, c1, c2, particle, rMatrix, GlobalBest) {
    const wVelocity = elementWiseMultiplicationWithConstant(particle.velocity, w);
    const subtractCurrentFromPBestPosition = elementWiseSubtraction(particle.bestPosition, particle.position);
    const subtractCurrentFromGlobalPosition = elementWiseSubtraction(GlobalBest.position, particle.position);
    const randomValuesArr = calculateRandomValues(rMatrix);
    const randomC1 = elementWiseMultiplicationWithConstant(randomValuesArr, c1);
    const randomC2 = elementWiseMultiplicationWithConstant(randomValuesArr, c2);
    const mulC1ToPbest = elementWiseMultiplication(randomC1, subtractCurrentFromPBestPosition);
    const mulC2ToGbest = elementWiseMultiplication(randomC2, subtractCurrentFromGlobalPosition);
    const addC1ToC2 = elementWiseAddition(mulC1ToPbest, mulC2ToGbest);
    const velocity = elementWiseAddition(wVelocity, addC1ToC2);
    return velocity;
}

/* 
    creates a matrix with random values as elements with fixed precision based on a range matrix
    @param {array} matrix - range represented by a matrix
    @return {array}
*/
function calculateRandomValues(matrix) {
    const tfMatrix = tf.randomUniform(matrix);
    const arr = Array.from(tfMatrix.arraySync());
    return fixPrecisionIn2D(arr, 5);
}

/* 
   creates a minimap
   @param {array} gBestPos
   @param {object} model 
*/
function createMiniMap(gBestPos, model) {
    const path = PathFromMotion(gBestPos, model);
    createPath('miniMap', path);

}

/* 
   creates a minimap final one
   @param {array} gBestPos
   @param {object} model
*/
function createFinalMap(gBestPos, model) {
    const path = PathFromMotion(gBestPos, model)
    createPath('maxMap', path)
}