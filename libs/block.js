class Generate {
    constructor(id) {
        this.id = id;
    }

    execFunc({transact}) {
        transact.currBlock = this.id;
        transact.nextBlock = this.id + 1;
    }
}

class Assign {
    constructor(id, paramName, paramValue) {
        this.id = id;
        this.paramName = paramName;
        this.paramValue = paramValue;
    }

    execFunc({transact}) {
        transact[this.paramName] = this.paramValue;
        transact.currBlock = this.id;
        transact.nextBlock = this.id + 1;
    }
}

class Enter {
    constructor(id) {
        this.id = id;
    }

    execFunc({transact, storage, queue}) {
        if (storage.enter) {
            if (queue.queue.indexOf(transact.id) === 0) {
                queue.queue.splice(0,1);
                transact.currBlock = this.id;
                transact.nextBlock = this.id + 1;
            }
        } else {
            queue.queue.push(transact.id);
        }
    }
}

class Leave {
    constructor(id) {
        this.id = id;
    }

    execFunc({transact, storage}) {
        storage.leave();
        transact.currBlock = this.id;
        transact.nextBlock = this.id + 1;
    }
}

class Advance {
    constructor(id, distributionFunc) {
        this.id = id;
        this.distributionFunc = distributionFunc;
    }

    execFunc({transact}) {

        transact.currBlock = this.id;
        transact.nextBlock = this.id + 1;
    }
}

const blocks = {
    Generate: Generate,
    Assign: Assign,
    Enter: Enter,
    Leave: Leave,
    Advance: Advance,

};

module.exports = blocks;
