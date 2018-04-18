const Blocks = require('./libs/block');
const Storage = require('./libs/storage');
const Transact = require('./libs/transact');
const Random = require('./libs/randomDistribution');
const Queue = require('./libs/queue');

const CEC = [];
const FEC = [];

const cars = new Storage('cars', 200);
const qCars = new Queue('qCars');

const model = [
    new Blocks.Generate(0),
    new Blocks.Assign(1, {pName: 'XCoordDest', func: Random.randomDUniform, min: 0, max: 99}),
    new Blocks.Assign(2, {pName: 'YCoordDest', func: Random.randomDUniform, min: 0, max: 99}),
    new Blocks.Enter(3),
    new Blocks.Advance(4, {distributionFunc: Random.randomUniform, min: 8, max: 12}),
    new Blocks.Assign(5, {pName: 'XCoord', pValue: 0}),
    new Blocks.Assign(6, {pName: 'YCoord', pValue: 0}),
    new Blocks.Assign(7, {pName: 'Dest', pValue: 9}),
    new Blocks.Transfer(8, 16),
    new Blocks.Advance(9, {distributionFunc: Random.randomUniform, min: 8, max: 12}),
    new Blocks.Assign(10, {pName: 'XCoordDest', pValue: 0}),
    new Blocks.Assign(11, {pName: 'YCoordDest', pValue: 0}),
    new Blocks.Assign(12, {pName: 'Dest', pValue: 14}),
    new Blocks.Transfer(13, 16),
    new Blocks.Leave(14),
    new Blocks.Terminate(15),

    new Blocks.Test(16, {
        func: (p1, p2) => {
            return (p1 !== p2);
        },
        elseDist: 23,
        p1: 'XCoord',
        p2: 'XCoordDest',
    }),
    new Blocks.Advance(17, {distributionFunc: Random.randomExponential, rate: 5, startShift: 2}),
    new Blocks.Test(18, {
        func: (p1, p2) => {
            return (p1 > p2);
        },
        elseDist: 21,
        p1: 'XCoord',
        p2: 'XCoordDest',
    }),
    new Blocks.Assign(19, {pName: 'XCoord', usage: '-'}),
    new Blocks.Transfer(20, 16),
    new Blocks.Assign(21, {pName: 'XCoord', usage: '+'}),
    new Blocks.Transfer(22, 16),

    new Blocks.Test(23, {
        func: (p1, p2) => {
            return (p1 !== p2);
        },
        elseDist: 30,
        p1: 'YCoord',
        p2: 'YCoordDest',
    }),
    new Blocks.Advance(24, {distributionFunc: Random.randomExponential, rate: 5, startShift: 2}),
    new Blocks.Test(25, {
        func: (p1, p2) => {
            return (p1 > p2);
        },
        elseDist: 28,
        p1: 'YCoord',
        p2: 'YCoordDest',
    }),
    new Blocks.Assign(26, {pName: 'YCoord', usage: '-'}),
    new Blocks.Transfer(27, 23),
    new Blocks.Assign(28, {pName: 'YCoord', usage: '+'}),
    new Blocks.Transfer(29, 23),

    new Blocks.Transfer(30),
];

let time = 0;
let maxTransactId = 0;

while (time < 480) {
    let transactGenerating = false;
    FEC.forEach(transact => {
        if (transact.currBlock === 0) {
            transactGenerating = true;
        }
    });
    if (!transactGenerating) {
        FEC.push(new Transact(maxTransactId, Random.randomExponential(2) + time));
        maxTransactId++;
    }

    let nextTime = 480;
    FEC.forEach(transact => {
        if (!transact.waiting) {
            if (transact.moveTime < nextTime) {
                nextTime = transact.moveTime;
            }
        }
    });

    FEC.forEach((transact, index) => {
        if (transact.moveTime <= nextTime) {
            CEC.push(transact);
            FEC.splice(index, 1);
        }
    });

    CEC.forEach((transact, index) => {
        const moveTimePrev = transact.moveTime;
        while (moveTimePrev === transact.moveTime) {
            model[transact.nextBlock].execFunc({transact, storage: cars, queue: qCars, CEC, index, time: nextTime});
            if (transact.waiting) {
                break;
            }
        }
    });

    CEC.forEach((transact, index) => {
        FEC.push(transact);
        CEC.splice(index, 1);
    });

    time = nextTime;
}

qCars.printResult(time);
cars.printResult(time);
