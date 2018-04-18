class Storage {
    constructor(name, size) {
        this.name = name;
        this.size = size;
        this.used = 0;
    }

    enter() {
        if (this.used < this.size) {
            this.used++;
            return true;
        }
        return false;
    }

    leave() {
        this.used--;
    }
}

module.exports = Storage;
