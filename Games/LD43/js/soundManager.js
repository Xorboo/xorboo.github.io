SM = null;

class SoundManager {
    constructor() {
        SM = this;

        this.bgMusic = PIXI.loader.resources["bgMusic"].sound;
        this.bgMusic.loop = true;
        this.bgMusic.play();

        this.button1 = PIXI.loader.resources["button1"].sound;
        this.button1.volume = 0.3;
        this.button2 = PIXI.loader.resources["button2"].sound;
        this.button2.volume = 0.3;
        this.bossDeath = PIXI.loader.resources["bossDeath"].sound;
        this.gameOver = PIXI.loader.resources["gameOver"].sound;
        this.win = PIXI.loader.resources["win"].sound;
        this.fire = PIXI.loader.resources["fire"].sound;
        this.fire.volume = 0.2;
        this.fire.loop = true;
        this.door = PIXI.loader.resources["door"].sound;
        this.door.volume = 0.4;
        this.item = PIXI.loader.resources["item"].sound;
        this.item.volume = 0.3;
    }

    static preloadSounds() {
        PIXI.loader
            .add("bgMusic", Params.sounds.bgMusic)
            .add("button1", Params.sounds.button1)
            .add("button2", Params.sounds.button2)
            .add("bossDeath", Params.sounds.bossDeath)
            .add("gameOver", Params.sounds.gameOver)
            .add("win", Params.sounds.win)
            .add("fire", Params.sounds.fire)
            .add("door", Params.sounds.door)
            .add("item", Params.sounds.item);
        Params.sounds.steps.addToLoader();
        Params.sounds.doDamage.addToLoader();
        Params.sounds.takeDamage.addToLoader();
    }

    playStep() {
        this.playRandom(Params.sounds.steps);
    }

    playDoDamage() {
        this.playWithDelay(Params.hitSoundDelay, () => this.playRandom(Params.sounds.doDamage));
    }

    playTakeDamage() {
        this.playWithDelay(Params.bossAttackSoundDelay, () => this.playRandom(Params.sounds.takeDamage));
    }

    playBossDeath() {
        this.playWithDelay(Params.bossDeathSoundDelay, () => this.bossDeath.play());
    }
    
    playGameOver() {
        this.gameOver.play();
    }

    playGameWin() {
        this.win.play();
    }

    setFirePlay(isPlaying) {
        if (isPlaying) {
            this.fire.play();
        }
        else {
            this.fire.stop();
        }
    }

    playDoor() {
        this.door.play();
    }

    playItem() {
        this.item.play();
    }

    playButton1() {
        this.button1.play();
    }

    playButton2() {
        this.button2.play();
    }
    
    playWithDelay(delay, callback) {
        var waitTimer = PIXI.timerManager.createTimer(1000 * delay);
        waitTimer.on('end', (elapsed) => {
            callback();
        });
        waitTimer.start();
    }

    playRandom(soundPack) {
        soundPack.playRandom();
    }
}