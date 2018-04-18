class Queue {
    constructor(name) {
        this.name = name;
        this._queue = [];
        this._sumTransacts = 0;
        this._currentTransacts = 0;
        this._maxTransacts = 0;
        this._timeInQueue = [];
        this._transactsInQueue = [];
    }

    pushTime(time) {
        this._timeInQueue.push(time);
    }

    queue(transact) {
        this._queue.push(transact);
        this._sumTransacts++;
        this._currentTransacts++;
        this._transactsInQueue.push(this._currentTransacts);
        if (this._currentTransacts > this._maxTransacts) {
            this._maxTransacts = this._currentTransacts;
        }
    }

    depart() {
        this._queue.shift();
        this._currentTransacts--;
    }

    searchTransact(transact) {
        return this._queue.indexOf(transact);
    }

    printResult(time) {
        this._queue.forEach(transact => {
            this._timeInQueue.push(time - transact.moveTime);
        });
        const avgTime = this._timeInQueue.reduce((sum, timeInQueue) => {
            sum += timeInQueue;
            return sum;
        }, 0) / this._timeInQueue.length;
        const avgTransacts = this._transactsInQueue.reduce((sum, transactsNum) => {
            sum += transactsNum;
            return sum;
        }, 0) / this._transactsInQueue.length;
        console.log(`Queue: ${this.name}, current transacts: ${this._currentTransacts}, sum transacts: ${this._sumTransacts}, max queue length: ${this._maxTransacts}, average transacts in queue: ${avgTransacts}, average time in queue: ${avgTime}`);
    }
}

module.exports = Queue;
