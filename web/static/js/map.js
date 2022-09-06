import Store from './variable.js'
import { _clone } from './helper.js';

// xs and ys can be fixed values in constructor
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

export async function redrawMap() {
    console.log(_clone(Store.currentMap))
    let board = document.getElementById("simulationBoard");
    board.innerHTML = undefined;
    const max = Store.currentMap[Store.targetPosition[0]][Store.targetPosition[1]]
    const ncol = Store.currentMap[0].length;
    const nrow = Store.currentMap.length;
    let tableHTML = '';
    let path = Store.path;
    for (let r = 0; r < nrow; r++) {
        let currentHTMLRow = `<tr id="s-row ${r}">`;
        for (let c = 0; c < ncol; c++) {
            const uavPosX = Store.uavPositionX + Math.round(Store.currentMap[0].length / 2 - 1);
            const uavPosY = Store.uavPositionY + Math.round(Store.currentMap.length / 2 - 1);
            const index = path.indexOf(`${c - uavPosY},${r - uavPosX}`);
            if (c == uavPosX && r == uavPosY) {
                currentHTMLRow += `<td id="s-col ${c}" class="s-col py-0 uav"><div class="particle-movement">${index + 1}</div></td>`;
            }
            else if (index > -1) {
                currentHTMLRow += `<td id="s-col ${c}" class="s-col py-0"><div class="particle-movement">${index + 1}</div></td>`;
                path.unshift()
            }
            else {
                currentHTMLRow += `<td id="s-col ${c}" class="s-col py-0" style="${generateColorBasedOnProb(Store.currentMap[Store.currentMap.length - 1 - r][c], max)}">
                    </td>`;
                // ${currentMap[currentMap.length - 1 - r][c]}
            }
        }
        tableHTML += `${currentHTMLRow}</tr>`;
    }
    board.innerHTML = tableHTML;
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

