class Hero extends PIXI.Container {
    constructor() {
        super();

        const heroSheets = Params.atlases.hero;
        this.heroIdle = this.createSprite(heroSheets.idle, "Rudolf_Idle", true);
        this.heroRun = this.createSprite(heroSheets.run, "Rudolf_Run", true);
        //this.heroSacrifice = this.createSprite(heroSheets.attack, "Rudolf_Attack", false);
        //this.heroHit = this.createSprite(heroSheets.hit, "Rudolf_Hit", false);
        //this.heroDeath = this.createSprite(heroSheets.death, "Rudolf_Death", false);
        //this.heroWin = this.createSprite(heroSheets.win, "Rudolf_Win", true);

        this.currentHero = null;
        this.startAnimation(this.heroIdle);
    }

    init() {
        this.isWalking = false;
        this.isDead = false;
        this.isWin = false;
    }

    createSprite(sheetName, animationName, loop) {
        const sheet = PIXI.loader.resources[sheetName].spritesheet;
        const animation = sheet.animations[animationName];
        let sprite = new PIXI.extras.AnimatedSprite(animation);
        sprite.scale.set(Params.downscaleFactor);
        sprite.anchor.set(0.5);
        sprite.visible = false;
        sprite.animationSpeed = Params.animationSpeed;
        sprite.loop = loop;
        sprite.onComplete = () => this.animationCompleted(sprite);
        this.addChild(sprite);
        return sprite;
    }

    startAnimation(sprite) {
        if (!sprite) {
            return;
        }

        if (this.currentHero) {
            this.currentHero.visible = false;
            this.currentHero.stop();
        }

        this.currentHero = sprite;
        this.currentHero.visible = true;
        this.currentHero.gotoAndPlay(0);
    }

    animationCompleted(sprite) {
        if (this.isDead || this.isWin) {
            return;
        }

        this.startAnimation(this.isWalking ? this.heroRun : this.heroIdle);
    }

    doSacrifice() {
        this.startAnimation(this.heroSacrifice);
        SM.playDoDamage();
    }

    doReceiveHit() {
        SM.playTakeDamage();
        this.startAnimation(this.heroHit);
    }

    startWalk(walkTime) {
        this.startAnimation(this.heroRun);

        this.isWalking = true;
        var walkTimer = PIXI.timerManager.createTimer(1000 * walkTime);

        let timeToStepSound = 0;
        walkTimer.on('update', (elapsed, deltaTime) => {
            timeToStepSound -= deltaTime;
            if (timeToStepSound < 0) {
                timeToStepSound = Params.stepPeriod;
                SM.playStep();
            }
        })
        walkTimer.on('end', (elapsed) => { this.stopWalk(); });
        walkTimer.start();
    }

    stopWalk() {
        this.isWalking = false;
        this.startAnimation(this.heroIdle);
    }

    // On game fail
    doDeath() {
        this.isDead = true;
        this.startAnimation(this.heroDeath);
        this.createLightning();
    }

    // On game complete
    doWin() {
        this.isWin = true;
        this.startAnimation(this.heroWin);
        this.createLightning();
    }

    createLightning() {
        const sheetName = Params.atlases.flashFx;
        const sheet = PIXI.loader.resources[sheetName].spritesheet;
        const animation = sheet.animations["Flash_FX"];
        let fxSprite = new PIXI.extras.AnimatedSprite(animation);
        fxSprite.anchor.set(0.5);
        fxSprite.position.set(0, -55);
        fxSprite.animationSpeed = Params.animationSpeed;
        fxSprite.loop = false;
        fxSprite.play();

        this.addChild(fxSprite);
    }
}