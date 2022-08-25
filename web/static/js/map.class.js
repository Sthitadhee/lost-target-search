export default class Map {

    constructor(model, target) {
        this.model = model;
        this.target = target;
    }

    drawMap() {
        const max = this.model.map[this.target.mean[0]][this.target.mean[1]]
        const nrow = this.model.map[0].length;
        const ncol = this.model.map.length;
        let tableHTML = '';
        for (let r = 0; r < nrow; r++) {
            let currentHTMLRow = `<tr id="s-row ${r}">`;
            for (let c = 0; c < ncol; c++) {
                const uavPosX = this.model.xs + Math.round(this.model.map[0].length / 2 - 1)
                const uavPosY = this.model.ys + Math.round(this.model.map.length / 2 - 1)
                if (c == uavPosX && r == uavPosY) {
                    currentHTMLRow += `<td id="s-col ${c}" class="s-col py-0 uav"><!-- <img src='static/img/uav.png' /> --></td>`;
                } else {
        const max = this.model.map[this.target.mean[0]][this.target.mean[1]]
                    currentHTMLRow += `<td id="s-col ${c}" class="s-col py-0" style="background: rgba(${this.generateColorBasedOnProb(this.model.map[this.model.map.length - 1 - r][c], max)})"></td>`;
                    // ${this.model.map[this.model.map.length - 1 - r][c]}
                }
            }
            tableHTML += `${currentHTMLRow}</tr>`;
        }
        let board = document.getElementById("simulationBoard");
        // console.log(board);
        board.innerHTML = tableHTML;
    }

    removeGrid() {
        const td = document.getElementsByTagName(td);
        console.log(td)
        // console.log('draw');
    }

    generateColorBasedOnProb(prob, max) {
        if (prob > 0) {
            return `0, 0, 0, ${prob/max - 0.3}`
        }
    }


}