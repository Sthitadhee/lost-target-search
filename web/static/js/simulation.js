import { drawMap } from './map.js'
import { runMpso } from './mpso.js'
import { normaliseMatrix, _clone } from './helper.js'
import Store from './variable.js'

const visualiseBtn = document.getElementById('visualise');
const settingsOpenBtn = document.getElementById('settings-open-btn');
const helpOpenBtn = document.getElementById('help-open-btn');
const helpCloseBtn = document.getElementById('help-close-btn');
const settingsCloseBtn = document.getElementById('settings-close-btn');
const settingsSelectionScene = document.getElementById('scenes');
const saveSettingBtn = document.getElementById('settings-save-btn');

helpOpenBtn.addEventListener('click', openHelp);
helpCloseBtn.addEventListener('click', closeHelp);
settingsOpenBtn.addEventListener('click', openSettings);
settingsCloseBtn.addEventListener('click', closeSettings);
settingsSelectionScene.addEventListener('change', changeScene);
saveSettingBtn.addEventListener('click', saveSettings);

// openHelp();
setTimeout(() => { closeHelp() }, 3000);
initialiseSimulation();

function initialiseSimulation() {
    
    const MAPSIZE_X = Store.mapSizeX;
    const MAPSIZE_Y = Store.mapSizeY;
    const MEAN = [Store.meanY, Store.meanX]
    const COVAR = [[Store.covariance, 0], [0, Store.covariance]]

    const model = {
        xs: Store.uavPositionX,
        ys: Store.uavPositionY,
        mrange: 4,
        n: Store.uavFlightSteps,
        xmin: -Math.floor(MAPSIZE_X / 2),
        xmax: Math.floor(MAPSIZE_X / 2),
        ymin: -Math.floor(MAPSIZE_Y / 2),
        ymax: Math.floor(MAPSIZE_Y / 2),
        X: Store.mean,
        Y: Store.mean,
        targetDir: 'E', // check allow option to change
        targetSteps: 10, // check allow option to change
        map: [],
        MAPSIZE_X: MAPSIZE_X,
        MAPSIZE_Y: MAPSIZE_Y,
    };
    let target = {
        mean: MEAN,
        covariance: COVAR,
    };
    
    fetchMap();
    
    async function fetchMap() {
        // JSON Request
        let fetchJsonRequest = {
            cache: 'no-cache',
            method: 'POST',
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
        let pmap = await data.json();
        const tensorPmap = tf.tensor(pmap, [MAPSIZE_Y, MAPSIZE_X], 'float32');
        const sum = Number((Number((tf.sum(tensorPmap)).dataSync())).toFixed(5));
        pmap = normaliseMatrix(pmap, sum, MEAN)
    
        model.map = _clone(pmap);
        Store.currentMap = _clone(pmap);
        drawMap();

        visualiseBtn.disabled = false;
        visualiseBtn.addEventListener('click', () => {
            visualiseAlgo(model)
        })
    }
}


function visualiseAlgo(model) {
    // call mpso
    if (Store.algo === 'MPSO') {
        runMpso(model);
    }
}

function openHelp() {
    const helpManualTag = document.getElementById('help');
    helpManualTag.style.display = 'initial';
    helpManualTag.style.opacity = 1;
}

function closeHelp() {
    const helpManualTag = document.getElementById('help');
    helpManualTag.style.display = 'none';
    helpManualTag.style.opacity = 0;
}

function openSettings() {
    const settingsTag = document.getElementById('settings');
    settingsTag.style.display = 'initial';
    settingsTag.style.opacity = 1;
}

function closeSettings() {
    const settingsTag = document.getElementById('settings');
    settingsTag.style.display = 'none';
    settingsTag.style.opacity = 0;
}

function changeScene(event) {
    const inputUavPositionX = document.getElementById('UavPositionX');
    const inputUavPositionY = document.getElementById('UavPositionY');
    const inputMean = document.getElementById('mean');
    const inputCovariance = document.getElementById('covariance');

    switch (event.target.value) {
        case 'Scene 2':
            inputUavPositionX.value = 0;
            inputUavPositionY.value = 0;
            inputMean.value = 5;
            inputCovariance.value = 1;
            break;
        case 'Scene 3':
            inputUavPositionX.value = 0;
            inputUavPositionY.value = 0;
            inputMean.value = 5;
            inputCovariance.value = 1;
            break;
        case 'Scene 4':
            inputUavPositionX.value = 0;
            inputUavPositionY.value = 0;
            inputMean.value = 5;
            inputCovariance.value = 1;
            break;
        case 'Scene 5':
            inputUavPositionX.value = 0;
            inputUavPositionY.value = 0;
            inputMean.value = 5;
            inputCovariance.value = 1;
            break;
        case 'Scene 6':
            inputUavPositionX.value = 0;
            inputUavPositionY.value = 0;
            inputMean.value = 5;
            inputCovariance.value = 1;
            break;
        default:
            inputUavPositionX.value = 0;
            inputUavPositionY.value = 0;
            inputMean.value = 3;
            inputCovariance.value = 2;
            break;
    }
}

function saveSettings() {
    const inputUavPositionX = document.getElementById('UavPositionX').value;
    const inputUavPositionY = document.getElementById('UavPositionY').value;
    const inputMeanX = document.getElementById('meanX').value;
    const inputMeanY = document.getElementById('meanY').value;
    const inputCovariance = document.getElementById('covariance').value;
    const inputAlgoType = document.getElementById('AlgoType').value;
    const inputAlgoSpeed = document.getElementById('AlgoSpeed').value;
    const inputMapDim = document.getElementById('mapSize').value;
    const inputUavFlightSteps = document.getElementById('UavSteps').value;

    
    
    Store.mapSizeX = Store.mapSizeY= Number(inputMapDim);
    Store.speed = Number(inputAlgoSpeed);
    Store.algo = inputAlgoType;
    Store.meanX = Number(inputMeanX);
    Store.meanY = Number(inputMeanY);
    Store.covariance = Number(inputCovariance);
    Store.uavPositionX = Number(inputUavPositionX);
    Store.uavPositionY = Number(inputUavPositionY);
    Store.uavFlightSteps = Number(inputUavFlightSteps);
    
    Store.targetPosition = [Store.meanY, Store.meanX]
    Store.currentMap = [];
    
    console.log(_clone(Store))
    initialiseSimulation();
    closeSettings();
}