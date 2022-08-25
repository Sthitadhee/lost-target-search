export function CreateRandomSolution() {
    let n = model.n;
    let startNode = [model.xs, model.ys]
    let path = []; //check this
    maxIterations = 100;

    motions = [
        [1, 0],
        [0.7071, 0.7071],
        [0, 1],
        [-0.7071, 0.7071],
        [-1, 0],
        [-0.7071, -0.7071],
        [0, -1],
        [0.7071, -0.7071],
    ]

    let shouldStart = true;

    while (shouldStart) {
        shouldStart = false;

        for (let iter = 0; iter < n; iter++) {
            path.push(startNode)
        }

        let position = [];
        currentNode = startNode;
        for (let iter = 0; iter < n; iter++) {
            let randomIndex = Math.floor(Math.random() * motions.length); //check const or let
            let motion = motions[randomIndex];
            let invalidFlag = true;
            iteration = 0;

            while (invalidFlag && it < maxIterations) {
                // motion is in motion space, nextMove is in cartesian space
                const nextMove = MotionDecode(motion); // check const
                const nextNode = currentNode + nextMove; // need tf probably or smth else (check) // check const
                invalidFlag = false;

                if (nextNode[1] > model.xmax) {
                    motion = motion[1];
                    invalidFlag = true;
                    iteration += 1;
                }
                else if (nextNode[1] < model.xmin) {
                    motion = motion[0];
                    invalidFlag = true;
                    iteration += 1;
                }
                else if (nextNode[2] > ymax) {
                    motion = motion[6];
                    invalidFlag = true;
                    iteration += 1;
                }
                else if (nextNode[2] < ymin) {
                    motion = motion[2];
                    invalidFlag = true;
                    iteration += 1;
                }
                else if (path.includes(nextNode)) {
                    randomIndex = Math.floor(Math.random() * motions.length); //check const or let
                    motion = motions[randomIndex];
                    invalidFlag = true;
                    iteration += 1;
                }
            }

            if (iteration >= maxIterations) {
                shouldStart = true;
                break;
            }
            else {
                path[iter] = nextNode;
                currentNode = nextNode;
                position[iter] = motion;
                return position;
            }

        }
    }
}


export function MotionDecode(motion) {
    const angle = Math.atan2(motion[2], motion[1]);
    const rounded = round(8 * angle / (2 * Math.PI) + 8);
    const octant = rounded % 8 + 1;
    moveArray = [
        [1, 0],
        [1, 1],
        [0, 1],
        [-1, 1],
        [-1, 0],
        [-1, -1],
        [0, -1],
        [1, -1]
    ];
    return moveArray[octant];
}