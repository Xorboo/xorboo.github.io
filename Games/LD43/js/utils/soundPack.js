class SoundPack {
    constructor(prefix, amount) {
        this.prefix = prefix;
        this.amount = amount;
    }

    addToLoader() {
        for (let i = 1; i <= this.amount; i++) {
            const name = this.getName(i);
            PIXI.loader.add(name, "assets/sounds/" + name + ".wav");
        }
    }

    playRandom() {
        const sound = this.getRandom();
        sound.play();
    }

    getRandom() {
        const index = this.getRandomInt(1, this.amount);
        const name = this.getName(index);
        return PIXI.loader.resources[name].sound
    }

    getName(index) {
        return this.prefix + index;
    }

    getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
}
