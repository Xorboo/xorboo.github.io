class StartScene extends SceneBase {
    constructor(switchCallback) {
        super(switchCallback);

        this.baseContainer = new PIXI.Container();
        this.addChild(this.baseContainer);

        this.currentIndex = 0;
        this.containers = [];
        this.createContainer({
            bg: Params.textures.intro.bg[0],
            text: "I always wanted\nto make a game...",
            addExtra: (container) => {
                let heroSprite = new PIXI.Sprite(Params.textures.intro.hero);
                heroSprite.anchor.set(0.5);
                heroSprite.position.set(Params.application.width - 230, Params.application.height - 160);
                container.addChild(heroSprite);
            },
        });
        this.createContainer({
            bg: Params.textures.intro.bg[1],
            text: "But it wasn't\nas easy as I thought...",
            addExtra: (container) => {
                StartScene.addHero(container);
                StartScene.addTorches(container);
            },
            onOpen: () => { SM.setFirePlay(true); }
        });
        this.createContainer({
            bg: Params.textures.intro.bg[2],
            text: "Sacrifices\nhad to be made...",
            addExtra: (container) => {
                StartScene.addHero(container);
                StartScene.addTorches(container);
            },
            onOpen: () => { SM.playDoor(); }
        });

        let textPanelSprite = new PIXI.Sprite(Params.textures.intro.textPanel);
        textPanelSprite.anchor.set(0.5);
        textPanelSprite.position.set(217, 280);
        this.addChild(textPanelSprite);

        this.introText = new PIXI.Text("???", Params.textStyle.introText);
        this.introText.anchor.set(0.5);
        this.introText.position.y = -40;
        textPanelSprite.addChild(this.introText);

        this.hintText = new PIXI.Text("Tap to continue...", Params.textStyle.hintText);
        this.hintText.anchor.set(0.5);
        this.hintText.position.set(Params.application.width * 0.5, Params.application.height - 50);
        this.addChild(this.hintText);

        this.addFullscreenButton(() => {
            SM.playButton2();
            this.showNextContainer();
        });
    }

    init(data) {
        super.init(data);

        this.currentIndex = -1;
        SM.setFirePlay(false);
        this.showNextContainer();
    }

    update(deltaTime) {
        super.update(deltaTime);

        if (0 < this.hintTimeout) {
            this.hintTimeout -= deltaTime;
            if (this.hintTimeout <= 0) {
                this.hintText.visible = true;
            }
        }
    }

    showNextContainer() {
        this.hideCurrentContainer();

        this.currentIndex++;
        if (this.currentIndex >= this.containers.length) {
            this.switchCallback(Params.sceneType.MAIN, {});
        }
        else {
            this.updateContainer();
        }

        if (this.currentContainer && this.currentContainer.onOpen) {
            this.currentContainer.onOpen();
        }

        this.hintTimeout = Params.hintDelay;
        this.hintText.visible = false;
    }

    updateContainer() {
        this.currentContainer = this.containers[this.currentIndex];
        this.currentContainer.container.visible = true;

        this.introText.text = this.currentContainer.text;
    }

    hideCurrentContainer() {
        if (this.currentContainer) {
            this.currentContainer.container.visible = false;
            this.currentContainer = null;
        }
    }

    createContainer(data) {
        let container = new PIXI.Container();
        container.visible = false;
        this.baseContainer.addChild(container);

        let sprite = PIXI.Sprite.fromImage(data.bg);
        sprite.width = Params.application.width;
        sprite.height = Params.application.height;
        container.addChild(sprite);

        data.addExtra(container);

        this.containers.push({
            container: container,
            text: data.text,
            onOpen: data.onOpen
        });
        return container;
    }

    static addHero(container) {
        const sheetName = Params.atlases.hero.idle;
        const sheet = PIXI.loader.resources[sheetName].spritesheet;
        const animation = sheet.animations["Rudolf_Idle"];
        let heroSprite = new PIXI.extras.AnimatedSprite(animation);
        heroSprite.scale.set(Params.downscaleFactor);
        heroSprite.anchor.set(0.5);
        heroSprite.position.set(Params.application.width - 275, Params.application.height - 175);
        heroSprite.animationSpeed = Params.animationSpeed;
        heroSprite.loop = true;
        heroSprite.play();
        container.addChild(heroSprite);
    }

    static addTorches(container) {
        let torchesContainer = new PIXI.Container();
        torchesContainer.position.set(Params.application.width - 30, Params.application.height + 55);
        container.addChild(torchesContainer);

        SceneBase.createTorch(torchesContainer, -455, -180, 0);
        SceneBase.createTorch(torchesContainer, -80, -175, 6);
        let baseSprite = new PIXI.Sprite(Params.textures.intro.torchBase);
        baseSprite.anchor.set(1.0);
        torchesContainer.addChild(baseSprite);

    }
}