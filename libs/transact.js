class Transact {
    constructor(id, startBlock, startTime) {
        this.id = id;
        this.currBlock = 0;
        this.nextBlock = startBlock;
        this.moveTime = startTime;
    }
}

module.exports = Transact;
