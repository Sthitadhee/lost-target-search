// the index file for the whole simulation

import { drawMap, drawSideInfo } from './map.js'
import { runMpso } from './mpso.js'
import { normaliseMatrix, _clone } from './helper.js'
import Store from './variable.js'

const visualiseBtn = document.getElementById('visualise');
let visualiseAddEventListenerActivated = false;
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
let model = {};

initialiseSimulation();
openHelp();

/* 
    initialises the simulation at start point
*/
function initialiseSimulation() {
    
    const MAPSIZE_X = Store.mapSizeX;
    const MAPSIZE_Y = Store.mapSizeY;
    const MEAN = [Store.meanY - 1, Store.meanX - 1] // python starts from 0
    const COVAR = [[Store.covariance, 0], [0, Store.covariance]]

    model = {
        xs: Store.uavPositionX,
        ys: Store.uavPositionY,
        mrange: 4,
        n: Store.uavFlightSteps,
        xmin: -Math.floor(MAPSIZE_X / 2),
        xmax: Math.floor(MAPSIZE_X / 2),
        ymin: -Math.floor(MAPSIZE_Y / 2),
        ymax: Math.floor(MAPSIZE_Y / 2),
        X: Store.meanX,
        Y: Store.meanY,
        targetDir: Store.targetDir, // check allow option to change
        targetSteps: 10, // check allow option to change
        map: [],
        MAPSIZE_X: MAPSIZE_X,
        MAPSIZE_Y: MAPSIZE_Y,
    };

    const target = {
        mean: MEAN,
        covariance: COVAR,
    };

    fetchMap();
    
    // fetches the first belief map matrix
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
        drawSideInfo();

        visualiseBtn.disabled = false;
        if(visualiseAddEventListenerActivated) { return }
        visualiseBtn.addEventListener('click', async (e) => {
            e.target.disabled = true;
            e.target.classList.add('bg-success');
            visualiseAlgo(e);
        });
        visualiseAddEventListenerActivated = true;
    }
}

/* 
    starts the running of mpso
    @param {event object} e
*/
function visualiseAlgo(e) {
    // call mpso
    if (Store.algo === 'MPSO') {
        runMpso(model, e);
    }
}

/* 
    opens the help dialog
*/
function openHelp() {
    const helpManualTag = document.getElementById('help');
    helpManualTag.style.display = 'initial';
    helpManualTag.style.opacity = 1;
}

/* 
    closes the help dialog
*/
function closeHelp() {
    const helpManualTag = document.getElementById('help');
    helpManualTag.style.display = 'none';
    helpManualTag.style.opacity = 0;
}

/* 
    opens the settings dialog
*/
function openSettings() {
    const settingsTag = document.getElementById('settings');
    settingsTag.style.display = 'initial';
    settingsTag.style.opacity = 1;
}

/* 
    opens the settings dialog
*/
function closeSettings() {
    const settingsTag = document.getElementById('settings');
    settingsTag.style.display = 'none';
    settingsTag.style.opacity = 0;
}

/* 
    changes the scene in the settings (not required at the moment)
    @param {event object} event
*/
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

/* 
    saves the changes in the settings dialog
*/
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
    Store.targetDir = Number(inputUavPositionY);
    Store.uavFlightSteps = Number(inputUavFlightSteps);
    
    Store.targetPosition = [Store.meanY - 1, Store.meanX - 1]
    Store.currentMap = [];
    Store.path = [];
    
    initialiseSimulation();
    closeSettings();
}