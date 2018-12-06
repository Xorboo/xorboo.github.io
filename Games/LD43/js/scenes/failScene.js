class FailScene extends SceneBase {
    constructor(switchCallback) {
        super(switchCallback, Params.textures.background.gameOver);

        this.headerText = new PIXI.Text(" You couldn't make it ", Params.textStyle.failHeader);
        this.headerText.anchor.set(0.5);
        this.headerText.position.set(Params.application.width / 2, Params.application.height / 2 + 50);
        this.addChild(this.headerText);
        
        /*this.hintText = new PIXI.Text("because", Params.textStyle.failHint);
        this.hintText.anchor.set(0.5);
        this.hintText.position.set(Params.application.width / 2, 190);
        this.addChild(this.hintText);*/

        this.reasonText = new PIXI.Text("???", Params.textStyle.failDescription);
        this.reasonText.anchor.set(0.5);
        this.reasonText.position.set(Params.application.width / 2,  Params.application.height / 2 + 120);
        this.addChild(this.reasonText);

        this.addCreditsButton(() => {
            SM.playButton2();
            this.switchCallback(Params.sceneType.START, {});
        });

        this.addCredits();
    }

    init(data) {
        super.init(data);

        SM.setFirePlay(false);

        this.reasonText.text = " " + data.loseChip.text + " ";
    }

    update(deltaTime) {
        super.update(deltaTime);
    }
}