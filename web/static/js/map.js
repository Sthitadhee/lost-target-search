import Store from './variable.js'
import { getMax, _clone } from './helper.js';

// draws the initial main map
export function drawMap() {
    const max = Store.currentMap[Store.targetPosition[0]][Store.targetPosition[1]]; // calculate the max position quickly
    const ncol = Store.currentMap[0].length;
    const nrow = Store.currentMap.length;
    let tableHTML = '';
    for (let r = 0; r < nrow; r++) {
        let currentHTMLRow = `<tr id="s-row ${r}">`;
        for (let c = 0; c < ncol; c++) {
            const uavPosX = Store.uavPositionX + Math.round(Store.currentMap[0].length / 2 - 1)
            const uavPosY = Store.uavPositionY + Math.round(Store.currentMap.length / 2 - 1)
            if (c == uavPosX && r == uavPosY) {
                currentHTMLRow += `<td id="s-col ${c}" class="s-col py-0 uav"><!-- <img src='static/img/uav.png' /> --></td>`;
            } else {
                currentHTMLRow += `<td id="s-col ${c}" class="s-col py-0" style="${generateColorBasedOnProb(Store.currentMap[Store.currentMap.length - 1 - r][c], max)}">
                    </td>`;
                // ${currentMap[currentMap.length - 1 - r][c]}
            }
        }
        tableHTML += `${currentHTMLRow}</tr>`;
    }
    let board = document.getElementById("simulationBoard");
    board.innerHTML = tableHTML;
}

// redraws the main map when map updates
export function redrawMap(result) {
    let board = document.getElementById("simulationBoard");
    board.innerHTML = undefined;
    let max;
    if(!result) {
        max = getMax(Store.currentMap);
    } else {
        max = Store.lastMax;
    }
    let ncol, nrow;
    if (!result) {
        ncol = Store.currentMap[0].length;
        nrow = Store.currentMap.length;
    } else {
        ncol = Store.lastTargetLocation[0].length;
        nrow = Store.lastTargetLocation.length;
    }

    let tableHTML = '';
    let path = Store.path;
    for (let r = 0; r < nrow; r++) {
        let currentHTMLRow = `<tr id="s-row ${r}">`;
        for (let c = 0; c < ncol; c++) {
            const uavPosX = Store.uavPositionX + Math.round(Store.currentMap[0].length / 2 - 1);
            const uavPosY = Store.uavPositionY + Math.round(Store.currentMap.length / 2 - 1);
            const index = path.indexOf(`${c - uavPosY},${r - uavPosX}`); // it might be possible I am drawing in opposite direction
            if (c == uavPosX && r == uavPosY) {
                currentHTMLRow += `<td id="s-col ${c}" class="s-col py-0 uav"><div class="particle-movement"></div></td>`;
            }
            else if (index > -1) {
                currentHTMLRow += `<td id="s-col ${c}" class="s-col py-0"><div class="particle-movement">${index + 1}</div></td>`;
                path.unshift()
            }
            else {
                if(!result) {
                    currentHTMLRow += `<td id="s-col ${c}" class="s-col py-0" style="${generateColorBasedOnProb(Store.currentMap[Store.currentMap.length - 1 - r][c], max)}"> </td>`;
                } else {
                    currentHTMLRow += `<td id="s-col ${c}" class="s-col py-0" style="${generateColorBasedOnProb(Store.lastTargetLocation[Store.lastTargetLocation.length - 1 - r][c], max)}"> </td>`;
                }
                   
                // ${currentMap[currentMap.length - 1 - r][c]}
            }
        }
        tableHTML += `${currentHTMLRow}</tr>`;
    }
    board.innerHTML = tableHTML;
}

// draws the side map
export function drawSideMap(cost) {
    let board = document.getElementById('simulationBoardSm');
    let pTag = document.getElementById('simulationBoardSmCost')
    board.innerHTML = undefined;
    const ncol = Store.currentMap[0].length;
    const nrow = Store.currentMap.length;
    let tableHTML = '';
    let path = Store.pathSmMap;
    for (let r = 0; r < nrow; r++) {
        let currentHTMLRow = `<tr id="s-row ${r}">`;
        for (let c = 0; c < ncol; c++) {
            const uavPosX = Store.uavPositionX + Math.round(Store.currentMap[0].length / 2 - 1);
            const uavPosY = Store.uavPositionY + Math.round(Store.currentMap.length / 2 - 1);
            const index = path.indexOf(`${c - uavPosY},${r - uavPosX}`); // it might be possible I am drawing in opposite direction
            if (c == uavPosX && r == uavPosY) {
                currentHTMLRow += `<td id="s-col ${c}" class="s-col sm py-0 uav"><div class="particle-movement sm"></div></td>`;
            }
            else if (index > -1) {
                currentHTMLRow += `<td id="s-col ${c}" class="s-col sm py-0"><div class="particle-movement sm">${index + 1}</div></td>`;
                path.unshift()
            }
            else {
                currentHTMLRow += `<td id="s-col ${c}" class="s-col sm py-0"></td>`;
            }
        }
        tableHTML += `${currentHTMLRow}</tr>`;
    }
    board.innerHTML = tableHTML;
    pTag.innerHTML = `Cost = ${cost}`
}

export function drawSideInfo() {
    let sideInfoDiv = document.getElementById('simulationInfo');
    let info = `<p class="algo-status">${Store.currentStatus}</p>`;
    info += `<p><span class="badge badge-secondary algo-status-details">Step Number</span> = <span class="badge badge-primary algo-status-details">${Store.currentMPSOindex} / ${Store.nParticles}<span/><p/>`
    if (!Store.isRandomInitialisation) {
        info = `<p class="algo-status">Initialising Particles Randomly</p>`;
        info += `<p><span class="badge badge-secondary algo-status-details">Step Number = </span> <span>${Store.nParticles} / ${Store.nParticles}<span/><p/>`
        info += `<p class="algo-status">${Store.currentStatus}</p>`;
        info += `<p><span class="badge badge-secondary algo-status-details">Step Number</span> = <span class="badge badge-primary algo-status-details">${Store.currentMPSOindex} / ${Store.nParticles}</span> <span class="badge badge-primary"> Repeats = ${Store.currentMpsoRepeatIndex} / ${Store.noMpsoRepeat - 1}</span></p>`
    }
    info += `<p> <span class="badge badge-secondary algo-status-details">Current Cost </span> = <span class="badge badge-primary algo-status-details"> ${Store.currentCost}</span></p>`
    info += `<p> <span class="badge badge-secondary algo-status-details">Best Global Cost </span> = <span class="badge badge-primary algo-status-details"> ${Store.currentGBest}</span></p>`
    sideInfoDiv.innerHTML = info;
}

function generateColorBasedOnProb(prob, max) {
    if (prob > 0) {
        const a = prob / max - 0.20;
        if (a < 0) { return `background: rgba(255, 255, 255, 1)` }
        return `background: rgba(0, 255, 0, ${a.toPrecision(1)}`
    } else {
        { return `background: rgba(255, 255, 255, 1)` }
    }
}

export function createPath(mapType, path) {
    let attribute;
    if (mapType === 'miniMap') {
        attribute = 'pathSmMap'
    }
    else {
        attribute = 'path'
    }
    Store[attribute] = [];
    for (let p = 0; p < path.length; p++) {
        Store[attribute].push(`${path[p][0]},${-path[p][1]}`);
    }
}
