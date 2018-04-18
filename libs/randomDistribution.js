class RandomDistribution {
    static randomExponential(rate = 1, startShift = 0) {
        return (-Math.log(Math.random()) * (rate - startShift) + startShift);
    }

    static randomDUniform(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    static randomUniform(min, max) {
        return Math.random() * (max - min) + min;
    }
}

module.exports = RandomDistribution;
