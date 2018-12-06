class FinishScene extends SceneBase {
    constructor(switchCallback) {
        super(switchCallback, Params.textures.background.gameWin);


        this.headerText = new PIXI.Text(" You've made a game! ", Params.textStyle.finishHeader);
        this.headerText.anchor.set(0.5);
        this.headerText.position.set(Params.application.width / 2, 26);
        this.addChild(this.headerText);

        this.hintText = new PIXI.Text(" But at what cost? ", Params.textStyle.finishHint);
        this.hintText.anchor.set(0.5);
        this.hintText.position.set(Params.application.width / 2, 260);
        this.addChild(this.hintText);

        this.addCreditsButton(() => {
            SM.playButton2();
            this.switchCallback(Params.sceneType.START, {});
        });

        this.addCredits();

        this.perks = [];
    }

    init(data) {
        super.init(data);

        SM.setFirePlay(false);

        this.clearPerks();

        // Spawn chips
        const chipsCount = GameData.handChipsCount;
        const width = 450;
        const height = 23;
        const elementsPerRow = 1;
        const startX = Params.application.width / 2 - width * (elementsPerRow / 2 - 0.5);
        const startY = 300;

        this.chipsButtons = [];
        for (let i = 0; i < data.finalChips.length; i++) {
            const chip = data.finalChips[i];
            const x = startX + width * (i % elementsPerRow);
            const y = startY + height * Math.floor(i / elementsPerRow);
            this.addPerk(chip, x, y);
        }
    }

    clearPerks() {
        for (let perkKey in this.perks) {
            this.removeChild(this.perks[perkKey]);
        }
        this.perks = [];
    }

    addPerk(chip, x, y) {
        const chipStyle = chip.gameOver ? Params.textStyle.finishChipBad : Params.textStyle.finishChip;
        let perk = new PIXI.Text(" " + chip.text + " ", chipStyle);
        perk.anchor.set(0.5);
        perk.position.set(x, y);
        this.addChild(perk);
        this.perks.push(perk);
    }

    update(deltaTime) {
        super.update(deltaTime);
    }
}