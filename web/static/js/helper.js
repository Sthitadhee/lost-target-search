// all the helper functions of the project

/* 
    Normalise matrix so that sum of element sums to one
    @param {array} matrix 
    @param {number} sum 
    @param {array} mean 
    @return {array} the normalised matrix
*/
export function normaliseMatrix(matrix, sum, mean) {
    matrix = _clone(matrix);
    const ncol = matrix[0].length;
    const nrow = matrix.length;
    let calcSum = 0;

    for (let r = 0; r < nrow; r++) {
        for (let c = 0; c < ncol; c++) {
            matrix[r][c] = Number((matrix[r][c] / sum).toFixed(4));
            calcSum += Number(matrix[r][c]);
            calcSum = Number(calcSum.toPrecision(7))
        }
    }
    const remainingSum = Number((1 - calcSum).toPrecision(7));
    matrix[mean[0]][mean[1]] = matrix[mean[0]][mean[1]] + remainingSum;
    matrix[mean[0]][mean[1]] = Number((matrix[mean[0]][mean[1]]).toPrecision(5));
    return matrix;
}

/* 
    Calculates the sum of all the elements of a matrix
    @param {array} matrix 
    @return {array} the sum of all the elements of matrix
*/
export function calcSum(matrix) {
    const ncol = matrix[0].length;
    const nrow = matrix.length;
    let sum = 0;

    for (let r = 0; r < nrow; r++) {
        for (let c = 0; c < ncol; c++) {
            sum += Number(matrix[r][c]);
            sum = roundToNDecPlaces(sum)
        }
    }
    return sum
}

/* 
    fixes the precision of all the elements within the matrix
    @param {array} matrix 
    @param {number} precision 
    @return {array} the matrix with required precision
*/
export function fixPrecisionIn2D(matrix, precision = 7) { //check
    const ncol = matrix[0].length;
    const nrow = matrix.length;

    for (let r = 0; r < nrow; r++) {
        for (let c = 0; c < ncol; c++) {
            matrix[r][c] = Number((matrix[r][c]).toPrecision(precision));
        }
    }
    return matrix;
}

/* 
    checks if elements within an array exists completely within another array
    @param {array} arr 
    @param {number} subarr 
    @return {boolean} 
*/
export function arrayAlreadyHasArray(arr, subarr) {
    for (var i = 0; i < arr.length; i++) {
        let checker = false
        for (var j = 0; j < arr[i].length; j++) {
            if (arr[i][j] === subarr[j]) {
                checker = true
            } else {
                checker = false
                break;
            }
        }
        if (checker) {
            return true
        }
    }
    return false
}

/* 
    Calculates elementwise multiplication for 2 matrices
    @param {array} twoDimArr1 
    @param {array} twoDimArr2 
    @return {array} 
*/
export function elementWiseMultiplication(twoDimArr1, twoDimArr2) {
    const valid = twoDimArr1.length === twoDimArr2.length;
    let arr = [];

    if (valid) {
        for (let i = 0; i < twoDimArr1.length; i++) {
            if (twoDimArr1[i].length === twoDimArr2[i].length) {
                arr[i] = [];
                for (let j = 0; j < twoDimArr1[i].length; j++) {
                    const mul = twoDimArr1[i][j] * twoDimArr2[i][j];
                    arr[i][j] = Number(mul.toPrecision(5)); //check
                }
            } else {
                throw new Error('Array dimension do not match! elementWiseMultiplication error!');
            }
        }
        return arr;
    }
    throw new Error('Array dimension do not match! elementWiseMultiplication error!');
}

/* 
    Calculates elementwise multiplication for 1 matrices with a constant
    @param {array} twoDimArr1 
    @param {array} constant 
    @return {array} 
*/
export function elementWiseMultiplicationWithConstant(twoDimArr1, constant) {
    let arr = [];

    for (let i = 0; i < twoDimArr1.length; i++) {
        arr[i] = [];
        for (let j = 0; j < twoDimArr1[i].length; j++) {
            const mul = twoDimArr1[i][j] * constant;
            arr[i][j] = Number(mul.toPrecision(5)); //check
        }
    }
    return arr;
}

/* 
    Calculates elementwise addition for 2 matrices
    @param {array} twoDimArr1 
    @param {array} twoDimArr2 
    @return {array} 
*/
export function elementWiseAddition(twoDimArr1, twoDimArr2) {
    const valid = twoDimArr1.length === twoDimArr2.length;
    let arr = [];

    if (valid) {
        for (let i = 0; i < twoDimArr1.length; i++) {
            if (twoDimArr1[i].length === twoDimArr2[i].length) {
                arr[i] = [];
                for (let j = 0; j < twoDimArr1[i].length; j++) {
                    const add = twoDimArr1[i][j] + twoDimArr2[i][j];
                    arr[i][j] = Number(add.toPrecision(5)); //check
                }
            } else {
                throw new Error('Array dimension do not match! elementWiseAddition error!');
            }
        }
        return arr;
    }
    throw new Error('Array dimension do not match! elementWiseAddition error!');
}

/* 
    Calculates elementwise subtraction for 2 matrices
    @param {array} twoDimArr1 
    @param {array} twoDimArr2 
    @return {array} 
*/
export function elementWiseSubtraction(twoDimArr1, twoDimArr2) {
    const valid = twoDimArr1.length === twoDimArr2.length;
    let arr = [];

    if (valid) {
        for (let i = 0; i < twoDimArr1.length; i++) {
            if (twoDimArr1[i].length === twoDimArr2[i].length) {
                arr[i] = [];
                for (let j = 0; j < twoDimArr1[i].length; j++) {
                    const add = twoDimArr1[i][j] - twoDimArr2[i][j];
                    arr[i][j] = Number(add.toPrecision(5)); //check
                }
            } else {
                throw new Error('Array dimension do not match! elementWiseAddition error!');
            }
        }
        return arr;
    }
    throw new Error('Array dimension do not match! elementWiseAddition error!');
}

/* 
    Creates delay between code execution for allowing varying speed
    @param {number} ms
    @return {promise object}
*/
export function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/* 
    Deep copies an array 
    @param {array} arr
    @return {array}
*/
export function _clone(arr) {
    return JSON.parse(JSON.stringify(arr))
}

/* 
    creates a function to whole precision operation in one line
    @param {number} number
    @param {number} N
    @return {number}
*/
export function roundToNDecPlaces(number, N = 4) {
    return Number(Number(number.toPrecision(N + 1)).toFixed(N));
}

/* 
    calculate the max value in a matrix
    @param {array} matrix
    @return {number}
*/
export function getMax(matrix) {
    return Math.max(...matrix.map(e => Array.isArray(e) ? getMax(e) : e));
}