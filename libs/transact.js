class Transact {
    constructor(id, startTime) {
        this.id = id;
        this.currBlock = 0;
        this.nextBlock = 0;
        this.moveTime = startTime;
        this.waiting = false;
    }
}

module.exports = Transact;
