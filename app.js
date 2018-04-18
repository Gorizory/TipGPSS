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
    new Blocks.Assign(1, {pName: 'YCoordDest', func: Random.randomUniform(0,99)}),
    new Blocks.Assign(2, 'YCoordDest', Random.randomUniform(0,99)),
    new Blocks.Enter(3),
    new Blocks.Advance(4, Random.randomUniform()),
];

let time = 0;
let maxTransactId = 0;

while (time < 480) {
    let transactGenerating = false;
    FEC.forEach(transact => {
        if (transact.nextBlock === 1) {
            transactGenerating = true;
        }
    });
    if (!transactGenerating) {
        FEC.push(new Transact(maxTransactId, 1, Random.randomExponential(2, time)));
        maxTransactId++;
    }

    let nextTime = 480;
    FEC.forEach(transact => {
        if (transact.moveTime < nextTime) {
            nextTime = transact.moveTime;
        }
    });
    FEC.forEach((transact, index) => {
        if (transact.moveTime === nextTime) {
            CEC.push(transact);
            FEC.splice(index, 1);
        }
    });

    FEC.forEach(transact => {
        model[transact.nextBlock].execFunc({transact, storage: cars, queue: qCars});
    });

    time = nextTime;
}
