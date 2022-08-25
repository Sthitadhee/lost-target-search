export default class Particle {
    constructor(Position=[], Velocity=[], Cost=[]) {
        this._position = Position;
        this._velocity = Velocity;
        this._cost = Cost;
        this._best = {
            cost: Cost,
            position: Position
        }
    }

    getPosition() {
        return this._position;
    }

    setPosition(Position) {
        this._position = Position;
    }

    getVelocity() {
        return this._velocity;
    }

    setVelocity(Velocity) {
        this._velocity = Velocity;
    }

    getCost() {
        return this._cost;
    }

    setCost(Cost) {
        this._cost = Cost;
    }

    getBestCost() {
        return this._best.cost;
    }

    getBestPosition() {
        return this._best.position;
    }

    getParticleBest() {
        return this._best;
    }

    setBestValue(bPosition, bCost) {
        this._best.position = bPosition;
        this._best.cost = bCost;
    }

    setAllParticleValues(Position, Velocity, Cost) {
        this.setPosition(Position);
        this.setVelocity(Velocity);
        this.setCost(Cost);
        this.setBestValue(Position, Cost);
    }
}