import Store from './variable.js'

export default class Map {

    constructor() {
    }

    drawMap(map, xs, ys) {
        const max = map[Store.targetPosition[0]][Store.targetPosition[1]]; // calculate the max position quickly
        const ncol = map[0].length;
        const nrow = map.length;
        let tableHTML = '';
        for (let r = 0; r < nrow; r++) {
            let currentHTMLRow = `<tr id="s-row ${r}">`;
            for (let c = 0; c < ncol; c++) {
                const uavPosX = xs + Math.round(map[0].length / 2 - 1)
                const uavPosY = ys + Math.round(map.length / 2 - 1)
                if (c == uavPosX && r == uavPosY) {
                    currentHTMLRow += `<td id="s-col ${c}" class="s-col py-0 uav"><!-- <img src='static/img/uav.png' /> --></td>`;
                } else {
                    currentHTMLRow += `<td id="s-col ${c}" class="s-col py-0" style="${this.generateColorBasedOnProb(map[map.length - 1 - r][c], max)}">
                    </td>`;
                    // ${map[map.length - 1 - r][c]}
                }
            }
            tableHTML += `${currentHTMLRow}</tr>`;
    }
        let board = document.getElementById("simulationBoard");
        board.innerHTML = tableHTML;
    }

    async redrawMap(map, xs, ys) {
        let board = document.getElementById("simulationBoard");
        board.innerHTML = undefined;
        const max = map[Store.targetPosition[0]][Store.targetPosition[1]]
        const ncol = map[0].length;
        const nrow = map.length;
        let tableHTML = '';
        let path = Store.path;
        for (let r = 0; r < nrow; r++) {
            let currentHTMLRow = `<tr id="s-row ${r}">`;
            for (let c = 0; c < ncol; c++) {
                const uavPosX = xs + Math.round(map[0].length / 2 - 1);
                const uavPosY = ys + Math.round(map.length / 2 - 1);
                const index = path.indexOf(`${c - uavPosY},${r - uavPosX}`);
                if (c == uavPosX && r == uavPosY) {
                    currentHTMLRow += `<td id="s-col ${c}" class="s-col py-0 uav"><div class="particle-movement">${index + 1}</div></td>`;
                }
                else if(index > -1){
                    currentHTMLRow += `<td id="s-col ${c}" class="s-col py-0"><div class="particle-movement">${index + 1}</div></td>`;
                    path.unshift()
                }
                else {
                    currentHTMLRow += `<td id="s-col ${c}" class="s-col py-0" style="${this.generateColorBasedOnProb(map[map.length - 1 - r][c], max)}">
                    </td>`;
                    // ${map[map.length - 1 - r][c]}
                }
            }
            tableHTML += `${currentHTMLRow}</tr>`;
        }
        board.innerHTML = tableHTML;
    }

    generateColorBasedOnProb(prob, max) {
        if (prob > 0) {
            const a = prob / max - 0.20;
            if (a < 0) { return `background: rgba(255, 255, 255, 1)` }
            return `background: rgba(0, 255, 0, ${a.toPrecision(1)}`
        } else {
            { return `background: rgba(255, 255, 255, 1)` }
        }
    }


}