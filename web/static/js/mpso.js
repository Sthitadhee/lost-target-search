import Particle from './particle.class.js'
import { CreateRandomSolution, myCost } from './matlab.func.js';
import Store from './variable.js'

export async function runMpso(model, map) {
    // ----- set all the parameters -----

    // PSO algo parameters
    const maxIteration = 100;
    const particlePopulation = 50;
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
    for(let i=0; i < particlePopulation; i++) {
        Store.targetPosition = [Store.mean, Store.mean]; // restore target position for every particle start

        const velocity = tf.zeros(randGeneratingMatrix);
        const position = CreateRandomSolution(model, map);
        const costP = await myCost(position, model, map)
        particles[i] = new Particle(position, velocity, costP);
        if( particles[i].getBestCost() > GlobalBest.cost) {
            GlobalBest = particles[i].getParticleBest();
        }
    }
    // create best cost data structure
    let BestCost = []

    // MPSO loop

    // Get the results

    // graph the results

}