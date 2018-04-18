class Storage {
    constructor(name, size) {
        this.name = name;
        this._size = size;
        this._used = 0;
        this._history = [];
    }

    enter(waiting) {
        if (!waiting) {
            this._history.push(this._used);
        }
        if (this._used < this._size) {
            this._used++;
            return true;
        }
        return false;
    }

    leave() {
        this._used--;
    }

    printResult(time) {
        const avgUsed = this._history.reduce((sum, usedNum) => {
            sum += usedNum;
            return sum;
        }, 0) / this._history.length;

        console.log(`Storage: ${this.name}, average idle time: ${(1 - avgUsed / this._size) * time}`);
    }
}

module.exports = Storage;
