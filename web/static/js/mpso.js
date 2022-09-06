import { CreateRandomSolution, myCost, PathFromMotion } from './matlab.func.js';
import Store from './variable.js'
import { delay, elementWiseAddition, elementWiseMultiplication, elementWiseMultiplicationWithConstant, elementWiseSubtraction, fixPrecisionIn2D } from './helper.js';
import { redrawMap } from './map.js';

export async function runMpso(model) {
    // ----- set all the parameters -----

    // PSO algo parameters
    const maxIteration = 100;
    const particlePopulation = 10;
    let w = 1;
    const wDamp = 0.98;
    const c1 = 2.5;
    const c2 = 2.5;

    //pso uav parameters
    const nFlightSteps = model.n;
    const randGeneratingMatrix = [model.n, 2] // not sure how it will work

    // pso boundary parameters
    const maxPosition = model.mrange;
    const minPosition = -model.mrange;
    const alpha = 2;
    const maxVelocity = alpha * (maxPosition - minPosition)
    const minVelocity = -maxVelocity;

    // ----- create particle obj -----
    let particles = {};
    let GlobalBest = {};
    GlobalBest.cost = -1;

    // do the random initialisation loop
    for (let i = 0; i < particlePopulation; i++) {
        // console.log(i);
        Store.targetPosition = [Store.meanY, Store.meanX]; // restore target position for every particle start

        let velocity = new Array(randGeneratingMatrix[0]);
        for (let i = 0; i < randGeneratingMatrix[0]; i++) {
            velocity[i] = new Array(randGeneratingMatrix[1]).fill(0.00000);
        }
        const position = CreateRandomSolution(model);
        const costP = await myCost(position, model)
        particles[i] = {
            velocity,
            position,
            cost: costP,
            bestCost: costP,
            bestPosition: position
        };
        if (particles[i].bestCost > GlobalBest.cost) {
            GlobalBest = {
                cost: particles[i].bestCost,
                position: particles[i].bestPosition
            };
        }
        throw new Error()
    }

    let p = GlobalBest.position;
    let cost = GlobalBest.cost;

    console.log(p, cost)
    const path = PathFromMotion(p, model)
    Store.path = [];
    for (let p = 0; p < path.length; p++) {
        Store.path.push(`${path[p][0]},${path[p][1]}`)
    }
    await delay(1000);
    redrawMap(true)


    // console.log(GlobalBest)
    // console.log(particles);
    // create best cost data structure
    let BestCost = []

    // MPSO loop
    // for(let it=0; it<maxIteration; it++) {
        
    //     for(let i=0; i < particlePopulation; i++) {
    //         Store.targetPosition = [Store.mean, Store.mean];
    
    //         particles[i].velocity = calculatedMpsoUpdatedVelocity(w, c1, c2, particles[i], randGeneratingMatrix, GlobalBest); //check
    //         particles[i].position = elementWiseAddition(particles[i].position, particles[i].velocity);
    //         const costP = await myCost(particles[i].position, model, map)
    //         particles[i].cost = costP;
    //         if(particles[i].cost > particles[i].bestCost) {
    //             particles[i].bestCost = particles[i].cost;
    //             particles[i].bestPosition = particles[i].position; //check for js arry problem
                
    //             if (particles[i].bestCost > GlobalBest.cost) {
    //                 GlobalBest = {
    //                     cost: particles[i].bestCost,
    //                     position: particles[i].bestPosition
    //                 };
    //             }
    //         }
    //     }

    //     BestCost[it] = {
    //         cost: GlobalBest.cost,
    //         position: GlobalBest.position
    //     };
    //     w = w * wDamp;
    // }
    // Get the results

    // graph the results

}


function calculatedMpsoUpdatedVelocity(w, c1, c2, particle, rMatrix, GlobalBest) {
    let velocity = undefined;
    const wVelocity = elementWiseMultiplicationWithConstant(particle.velocity, w);
    const subtractCurrentFromPBestPosition = elementWiseSubtraction(particle.bestPosition, particle.position);
    const subtractCurrentFromGlobalPosition = elementWiseSubtraction(GlobalBest.position, particle.position);
    const randomValuesArr = calculateRandomValues(rMatrix);
    const randomC1 = elementWiseMultiplicationWithConstant(randomValuesArr, c1);
    const randomC2 = elementWiseMultiplicationWithConstant(randomValuesArr, c2);
    const mulC1ToPbest = elementWiseMultiplication(randomC1, subtractCurrentFromPBestPosition);
    const mulC2ToGbest = elementWiseMultiplication(randomC2, subtractCurrentFromGlobalPosition);
    const addC1ToC2 = elementWiseAddition(mulC1ToPbest + mulC2ToGbest);
    velocity = elementWiseAddition(wVelocity, addC1ToC2);
    return velocity;
}

function calculateRandomValues(matrix) {
    const tfMatrix = tf.randomUniform(matrix);
    const arr = Array.from(tfMatrix.arraySync());
    return fixPrecisionIn2D(arr, 5);
}