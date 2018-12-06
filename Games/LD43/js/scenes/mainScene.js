class BossHint extends PIXI.Text {
    constructor(text) {
        super(text, Params.textStyle.bossHint);

        this.anchor.set(0.5);
        this.position.set(Params.application.width / 2, Params.application.height - 220);
    }
};

class MainScene extends SceneBase {
    constructor(switchCallback) {
        super(switchCallback);

        // Add background
        const wallShift = 10, wallHeight = 232;
        this.tilingBackground = new PIXI.extras.TilingSprite(
            Params.textures.background.tilingWall,
            Params.application.width,
            wallHeight
        );
        this.tilingBackground.position.y = wallShift
        this.addChild(this.tilingBackground);
        
        this.tilingFloor = new PIXI.extras.TilingSprite(
            Params.textures.background.tilingFloor,
            Params.application.width,
            143
        );
        this.tilingFloor.position.y = this.tilingBackground.position.y + wallHeight
        this.addChild(this.tilingFloor);

        // Middle container
        this.gameContainer = new PIXI.Container();
        this.addChild(this.gameContainer);

        // Boss container
        this.bossContainer = new PIXI.Container();
        this.gameContainer.addChild(this.bossContainer);

        // UI background
        const torchY = Params.application.height - 175;
        SceneBase.createTorch(this, 65, torchY, 0);
        SceneBase.createTorch(this, Params.application.width - 50, torchY, 3);
        this.uiBackground = new PIXI.Sprite(Params.textures.background.gameUI);
        this.uiBackground.width = Params.application.width;
        this.uiBackground.height = Params.application.height;
        this.addChild(this.uiBackground);

        // Top panel
        this.levelNumberSprite = new PIXI.Sprite(Params.textures.background.levelNumber);
        this.levelNumberSprite.anchor.set(0.5, 0.0);
        this.levelNumberSprite.position.set(Params.application.width / 2, 15);
        this.addChild(this.levelNumberSprite);

        this.levelHeader = new PIXI.Text("???", Params.textStyle.levelHeader);
        this.levelHeader.anchor.set(0.5);
        this.levelHeader.position.set(0.0, 40.0);
        this.levelNumberSprite.addChild(this.levelHeader);

        // Sacrifice text
        this.sacrificeHeaderSmall = new PIXI.Text("Choose Your", Params.textStyle.sacrificeSmall);
        this.sacrificeHeaderSmall.anchor.set(0.5);
        this.sacrificeHeaderSmall.position.set(Params.application.width / 2, Params.application.height - 188);
        this.addChild(this.sacrificeHeaderSmall);

        this.sacrificeHeader = new PIXI.Text("Sacrifice", Params.textStyle.sacrifice);
        this.sacrificeHeader.anchor.set(0.5);
        this.sacrificeHeader.position.set(Params.application.width / 2, Params.application.height - 168);
        this.addChild(this.sacrificeHeader);


        // Spawn chips
        const chipsCount = GameData.handChipsCount;
        const width = Params.chipButtonWidth;
        const height = Params.chipButtonHeight;
        const elementsPerRow = 2;
        const startX = Params.application.width / 2 - width * (elementsPerRow / 2 - 0.5);
        const startY = Params.application.height - 135;

        this.chipsButtons = [];
        for (let i = 0; i < chipsCount; ++i) {
            const chipButton = new ChipButton(null, (damage, chip) => this.onChipClicked(damage, chip));
            chipButton.position.set(startX + width * (i % elementsPerRow), startY + height * Math.floor(i / elementsPerRow));
            this.addChild(chipButton);

            this.chipsButtons.push(chipButton);
        }

        // Add hero
        this.hero = new Hero();
        this.hero.position.set(this.getUnitShiftX(), this.getUnitPositionY());
        this.gameContainer.addChild(this.hero);

        this.popup = new Popup();
        this.addChild(this.popup);
        this.popup.position.set(Params.application.width * 0.5, Params.application.height * 0.5);
    }

    init(data) {
        super.init(data);

        // Init everything
        this.hero.init();
        this.updateChipButtons();

        // Start game logic
        this.startGame();
    }

    getUnitPositionY() {
        return Params.application.height / 2 - 45;
    }

    getUnitShiftX() {
        return 175;
    }

    update(deltaTime) {
        super.update(deltaTime);
        this.popup.update(deltaTime);
    }

    onChipClicked(damage, chip) {
        SM.playButton1();

        this.currentBoss.receiveDamage(damage);
        console.log("Boss damaged on " + damage + ", hp left: " + this.currentBoss.health);

        this.hero.doSacrifice();

        if (this.currentBoss.isDead()) {
            console.log("Boss defeated");

            // Disable player actions
            this.setChipButtonsEnabled(false);

            // Hide dead boss hint
            if (this.currentBossHint) {
                this.removeChild(this.currentBossHint);
                this.currentBossHint = null;
            }
            
            // Start next boss sequence
            var delayTimer = PIXI.timerManager.createTimer(1000 * Params.afterKillDelay);
            delayTimer.on('end', (elapsed) => {
                this.moveToNextBoss();
            });
            delayTimer.start();
        }

        this.popup.setText("You've sacrificed:", '"' + chip.text + '"', null, null, true);
    }

    updateChipButtons() {
        let initialChips = GameData.getInitialChips();
        for (let i = 0; i < initialChips.length; i++) {
            this.chipsButtons[i].setChip(initialChips[i]);
        }
    }

    startGame() {
        if (this.currentBoss) {
            this.removeChild(this.currentBoss);
        }

        this.bossIndex = 0;
        this.updateBossIndex(0.0, Params.introWalkTime + Params.bossIndexUpdatePause);
        this.initBoss();

        // Start first movement animation
        // TODO? Move player from left side of the screen first
        // Disable player actions for animation
        this.disableChipsFor(Params.introWalkTime);
        this.animateCoreMovement(Params.introWalkTime);
    }

    moveToNextBoss() {
        // Check for game over
        let killedBossIndex = this.bossIndex;
        this.hasGameOverChip = false;
        for (let i = 0; i < this.chipsButtons.length; i++) {
            const nextChip = this.chipsButtons[i].getNextChip(killedBossIndex);
            if (nextChip && nextChip.gameOver) {
                this.hasGameOverChip = true;
                this.gameOverChip = nextChip;
            }
        }

        // Evolve buttons animation
        var evolveTimer = PIXI.timerManager.createTimer(1000 * Params.chipEvolvePause);
        evolveTimer.repeat = this.chipsButtons.length;
        evolveTimer.on('repeat', (elapsed, repeat) => {
            const chipButton = this.chipsButtons[repeat + Params.levelHeaderUpdateDelay];

            const isSacrificed = chipButton.isSacrificed;
            const oldText = chipButton.chip.text;
            chipButton.evolveChip(killedBossIndex);
            const newText = chipButton.chip.text;

            chipButton.interactive = false;

            if (isSacrificed) {
                this.popup.setText(null, '"' + oldText + '"', null, '"' + newText + '"', true, chipButton.chip.gameOver);
            } else {
                this.popup.setText(null, '"' + oldText + '"', null, '"' + newText + '"', false, chipButton.chip.gameOver);
            }
        });
        evolveTimer.start();

        // Calculate walk animation time
        const animationLength = this.getAnimationLength();

        // Disable player actions for animation
        this.disableChipsFor(animationLength, this.hasGameOverChip);

        // Move dead boss
        this.currentBoss.doFakeWalk(animationLength, (boss) => this.removeChild(boss));

        this.bossIndex++;
        
        // If we have more bosses to fight
        if (this.bossIndex < GameData.bosses.length) {
            // Spawn new boss if needed
            if (!this.hasGameOverChip) {
                const titleDelay = animationLength + Params.bossIndexUpdatePause;
                this.updateBossIndex(titleDelay, titleDelay);
            }

            // Create new boss and move him
            if (!this.hasGameOverChip) {
                this.initBoss();
            }
            this.animateCoreMovement(animationLength);

            // Check if we evolved to a game over chip
            if (this.hasGameOverChip) {
                var gameOverTimer = PIXI.timerManager.createTimer(1000 * animationLength);
                gameOverTimer.on('end', (elapsed) => {
                    this.loseGame(this.gameOverChip);
                });
                gameOverTimer.start();
            }
        }
        else {
            this.animateCoreMovement(animationLength, false);

            var gameWinTimer = PIXI.timerManager.createTimer(1000 * animationLength);
            gameWinTimer.on('end', (elapsed) => {
                this.finishGame();
            });
            gameWinTimer.start();
        }
    }

    setChipButtonsEnabled(isEnabled) {
        for (let i = 0; i < this.chipsButtons.length; i++) {
            const chipButton = this.chipsButtons[i];
            chipButton.interactive = isEnabled;
            if (!isEnabled) {
                chipButton.setNormalTextStyle();
            }
        }
    }

    updateBossIndex(delay, hintDelay) {
        const levelStrings = ["ONE", "TWO", "THREE", "FOUR"];
        const updateTitle = () => {
            this.levelHeader.text = "LEVEL " + levelStrings[Math.min(this.bossIndex, levelStrings.length - 1)];
        };

        if (delay > 0) {
            var titleDelayTimer = PIXI.timerManager.createTimer(1000 * delay);
            titleDelayTimer.on('end', elapsed => { updateTitle(); });
            titleDelayTimer.start();
        }
        else {
            updateTitle();
        }
        
        const showHint = () => {
            this.currentBossHint = new BossHint(GameData.bosses[this.bossIndex].hint);
            this.addChild(this.currentBossHint);
        };

        if (hintDelay > 0) {
            var hintDelayTimer = PIXI.timerManager.createTimer(1000 * hintDelay);
            hintDelayTimer.on('end', elapsed => { showHint(); });
            hintDelayTimer.start();
        }
        else {
            showHint();
        }
    }

    disableChipsFor(animationLength, forever = false) {
        this.setChipButtonsEnabled(false);

        if (!forever) {
            var enableChipsTimer = PIXI.timerManager.createTimer(1000 * animationLength);
            enableChipsTimer.on('end', (elapsed) => {
                this.setChipButtonsEnabled(true);
            });
            enableChipsTimer.start();
        }
    }

    animateCoreMovement(animationLength, animateNewBoss = true) {
        this.hero.startWalk(animationLength);
        if (animateNewBoss) {
            this.currentBoss.doWalk(this.getDesiredBossPosition(), animationLength);
        }

        var coreTimer = PIXI.timerManager.createTimer(1000 * animationLength);
        coreTimer.on('update', (elapsed, deltaTime) => {
            this.tilingBackground.tilePosition.x -= Params.shiftSpeed * deltaTime;
            this.tilingFloor.tilePosition.x -= Params.shiftSpeed * deltaTime;
        });
        coreTimer.start();
    }

    getDesiredBossPosition() {
        return Params.application.width - this.getUnitShiftX();
    }

    initBoss() {
        this.currentBoss = new Boss(this.bossIndex);
        this.currentBoss.position.set(Params.application.width + 200, this.getUnitPositionY() - 10);
        this.bossContainer.addChild(this.currentBoss);

        this.currentBoss.onDealDamage = (boss) => { this.hero.doReceiveHit() };
    }

    getAnimationLength() {
        return Params.chipEvolvePause * (1 + this.chipsButtons.length) + Params.extraWalkTime;
    }

    loseGame(chip) {
        SM.playGameOver();
        this.hero.doDeath();

        var newScreenTimer = PIXI.timerManager.createTimer(1000 * Params.gameLosePause);
        newScreenTimer.on('end', (elapsed) => {
            this.switchCallback(Params.sceneType.FAIL, {
                loseChip: chip
            });
        });
        newScreenTimer.start();
    }

    finishGame() {
        SM.playGameWin();
        this.hero.doWin();

        var newScreenTimer = PIXI.timerManager.createTimer(1000 * Params.gameWinPause);
        newScreenTimer.on('end', (elapsed) => {
            let finalState = {
                finalChips: this.chipsButtons.map(chipButton => chipButton.chip)
            };
            this.switchCallback(Params.sceneType.FINISH, finalState);
        });
        newScreenTimer.start();
    }
}