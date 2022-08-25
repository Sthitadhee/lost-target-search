import Map from './map.class.js'
import Model from './model.class.js'
import Target from './target.class.js'
import { runMpso } from './mpso.js'

const visualiseBtn = document.getElementById('visualise');

const MAPSIZE_X = 40
const MAPSIZE_Y = 40
const MEAN = [5,5]
const COVAR = [[4,0], [0,4]]
const ALGO = 'MPSO'


let model = new Model(MAPSIZE_X, MAPSIZE_Y);
let target = new Target(MEAN, COVAR)

fetchMap();

async function fetchMap() {
    // JSON Request
    let fetchJsonRequest = {
        cache: "no-cache",
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            data: {
                model,
                target,
            }
        }),
    }
    const data = await fetch(`${window.origin}/result`, fetchJsonRequest)
    const pmap = await data.json();

    model.map = pmap;
    const map = new Map(model, target);
    map.drawMap()
    visualiseBtn.disabled = false;
    visualiseBtn.addEventListener("click", () => {
        visualiseAlgo(model)
    })
}

function visualiseAlgo(model) {
    if(ALGO == 'MPSO') {
        // call mpso
        runMpso(model);
    }

}