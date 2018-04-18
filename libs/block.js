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
    constructor(id, {pName, pValue, func, min, max, usage}) {
        this.id = id;
        this.paramName = pName;
        this.min = min;
        this.max = max;
        if (typeof pValue !== 'undefined') {
            this.paramValue = pValue;
        }
        if (func) {
            this.func = func.bind(this);
        }
        this.usage = usage;
    }

    execFunc({transact}) {
        if (typeof this.paramValue !== 'undefined') {
            transact[this.paramName] = this.paramValue;
        }
        if (this.usage === '-') {
            transact[this.paramName] = transact[this.paramName] - 1;
        }
        if (this.usage === '+') {
            transact[this.paramName] = transact[this.paramName] + 1;
        }
        if (this.func) {
            transact[this.paramName] = this.func(this.min, this.max);
        }
        transact.currBlock = this.id;
        transact.nextBlock = this.id + 1;
    }
}

class Enter {
    constructor(id) {
        this.id = id;
    }

    execFunc({transact, storage, queue, time}) {
        if (storage.enter(transact.waiting)) {
            if (queue.searchTransact(transact) < 0) {
                queue.queue(transact);
            }
            if (queue.searchTransact(transact) === 0) {
                transact.waiting = false;
                queue.depart();
                queue.pushTime(time - transact.moveTime);
                transact.currBlock = this.id;
                transact.nextBlock = this.id + 1;
            }
        } else {
            transact.waiting = true;
            if (queue.searchTransact(transact) < 0) {
                queue.queue(transact);
            }
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
    constructor(id, {distributionFunc, min, max, rate, startShift}) {
        this.id = id;
        this.distributionFunc = distributionFunc.bind(this);
        this.min = min;
        this.max = max;
        this.rate = rate;
        this.startShift = startShift;
    }

    execFunc({transact}) {
        if (this.min && this.max) {
            transact.moveTime += this.distributionFunc(this.min, this.max);
        } else {
            transact.moveTime += this.distributionFunc(this.rate, this.startShift);
        }
        transact.currBlock = this.id;
        transact.nextBlock = this.id + 1;
    }
}

class Transfer {
    constructor(id, dest) {
        this.id = id;
        this.dest = dest;
    }

    execFunc({transact}) {
        transact.currBlock = this.id;
        if (this.dest) {
            transact.nextBlock = this.dest;
        } else {
            transact.nextBlock = transact['Dest'];
        }
    }
}

class Terminate {
    constructor(id) {
        this.id = id;
    }

    execFunc({transact, CEC, index}) {
        transact.currBlock = this.id;
        transact.nextBlock = null;
        transact.moveTime = null;
        CEC.splice(index, 1);
    }
}

class Test {
    constructor(id, {func, elseDist, p1, p2}) {
        this.id = id;
        this.func = func.bind(this);
        this.elseDist = elseDist;
        this.p1 = p1;
        this.p2 = p2;
    }

    execFunc({transact}) {
        transact.currBlock = this.id;
        if (this.func(transact[this.p1], transact[this.p2])) {
            transact.nextBlock = this.id + 1;
        } else {
            transact.nextBlock = this.elseDist;
        }
    }
}

const blocks = {
    Generate,
    Assign,
    Enter,
    Leave,
    Advance,
    Transfer,
    Terminate,
    Test,
};

module.exports = blocks;
