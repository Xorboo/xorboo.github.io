class SceneBase extends PIXI.Container {
    constructor(switchCallback, backgroundTexture) {
        super();

        this.switchCallback = switchCallback;

        // TODO? Keep aspect and envelope?
        if (backgroundTexture) {
            this.background = new PIXI.Sprite(backgroundTexture);
            this.background.anchor.set(0.5);
            this.background.position.set(Params.application.width / 2, Params.application.height / 2);
            this.background.width = Params.application.width;
            this.background.height = Params.application.height;
            this.addChild(this.background);
        }
    }

    init(data) {
    }

    update(deltaTime) {
    }

    addCredits() {
        const credits = Params.credits;
        const chipsCount = credits.length;
        const width = 160;
        const height = 30;
        const elementsPerRow = 2;
        const startX = Params.application.width / 2 - width * (elementsPerRow / 2 - 0.5);
        const startY = Params.application.height - 60;

        this.creditLines = [];
        for (let i = 0; i < chipsCount; ++i) {
            const credit = credits[i];
            const x = startX + width * (i % elementsPerRow);
            const y = startY + height * Math.floor(i / elementsPerRow);
            this.addCreditsLine(credit[0], credit[1], x, y);
        }
    }

    addCreditsLine(text, url, x, y) {
        let line = new BaseTextButton(
            null, null, 
            " " + text + " ", 
            Params.textStyle.credits, Params.textStyle.creditsHover);
        line.text.anchor.set(0.5);
        line.position.set(x, y);
        line.onClick(() => {
            SM.playButton2();
            window.open(url, "_blank");
        });
        this.addChild(line);
        this.creditLines.push(line);
    }

    addFullscreenButton(callback) {
        let fullscreenButton = new BaseTextButton(Params.textures.button.pixel);
        fullscreenButton.button.alpha = 0;
        fullscreenButton.button.width = Params.application.width;
        fullscreenButton.button.height = Params.application.height;
        fullscreenButton.position.set(Params.application.width / 2, Params.application.height / 2)
        fullscreenButton.onClick(callback);
        this.addChild(fullscreenButton);
        return fullscreenButton;
    }

    addCreditsButton(callback) {
        const sheetName = Params.atlases.replay;
        const sheet = PIXI.loader.resources[sheetName].spritesheet;
        const animation = sheet.animations["Buton_Replay"];
        let creditsButton = new PIXI.extras.AnimatedSprite(animation);
        creditsButton.anchor.set(1.0);
        creditsButton.position.set(Params.application.width, Params.application.height - 5);
        creditsButton.animationSpeed = Params.animationSpeed;
        creditsButton.loop = true;
        creditsButton.interactive = true;
        creditsButton.buttonMode = true;
        creditsButton.play();
        creditsButton.on('pointertap', () => callback());
        this.addChild(creditsButton);
        return creditsButton;
    }
    
    static createTorch(container, x, y, frame = 0) {
        const sheetName = Params.atlases.torch;
        const sheet = PIXI.loader.resources[sheetName].spritesheet;
        const animation = sheet.animations["Fire_torch"];
        let torchSprite = new PIXI.extras.AnimatedSprite(animation);
        torchSprite.scale.set(Params.downscaleFactor);
        torchSprite.anchor.set(0.5);
        torchSprite.position.set(x, y);
        torchSprite.animationSpeed = Params.animationSpeed;
        torchSprite.loop = true;
        torchSprite.gotoAndPlay(frame);

        container.addChild(torchSprite);
    }
}