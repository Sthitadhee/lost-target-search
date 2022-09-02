export function normaliseMatrix(matrix, sum, mean) {
    matrix = JSON.parse(JSON.stringify(matrix))
    const ncol = matrix[0].length;
    const nrow = matrix.length;
    let calcSum = 0;

    for(let r=0; r < nrow; r++) {
        for(let c=0; c < ncol; c++) {
            matrix[r][c] = Number((matrix[r][c] / sum).toFixed(6));
            calcSum += Number(matrix[r][c]);
            calcSum = Number(calcSum.toPrecision(7))
        }
    }
    const remainingSum = Number((1 - calcSum).toPrecision(7));
    matrix[mean[0]][mean[1]] = matrix[mean[0]][mean[1]] + remainingSum;
    matrix[mean[0]][mean[1]] = Number((matrix[mean[0]][mean[1]]).toPrecision(7));
    return matrix;
}

export function calcSum(matrix) {
    const ncol = matrix[0].length;
    const nrow = matrix.length;
    let sum = 0;

    for(let r=0; r < nrow; r++) {
        for(let c=0; c < ncol; c++) {
            sum += Number(matrix[r][c]);
            sum = Number(sum.toPrecision(7))
        }
    }
    return sum
}

export function fixPrecisionIn2D(matrix) {
    const ncol = matrix[0].length;
    const nrow = matrix.length;
    let sum = 0;

    for(let r=0; r < nrow; r++) {
        for(let c=0; c < ncol; c++) {
            matrix[r][c] = Number((matrix[r][c]).toPrecision(7));
        }
    }
    return matrix;
}

export function arrayAlreadyHasArray(arr, subarr){
    for(var i = 0; i<arr.length; i++){
        let checker = false
        for(var j = 0; j<arr[i].length; j++){
            if(arr[i][j] === subarr[j]){
                checker = true
            } else {
                checker = false
                break;
            }
        }
        if (checker){
            return true
        }
    }
    return false
}

export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}