class BaseTextButton extends PIXI.Container {
    constructor(normalImage, pressedImage, text, normalTextStyle, hoveredTextStyle) {
        super();

        this.interactive = true;
        this.buttonMode = true;
        this
            .on('pointerdown', this.onButtonDown)
            .on('pointerup', this.onButtonUp)
            .on('pointerupoutside', this.onButtonUp)
            .on('pointerover', this.onButtonOver)
            .on('pointerout', this.onButtonOut)
            .on('click', this.onButtonClicked);

        if (normalImage) {
            if (!pressedImage) {
                pressedImage = normalImage;
            }

            this.normalTexture = PIXI.Texture.fromImage(normalImage);
            this.pressedTexture = PIXI.Texture.fromImage(pressedImage);

            this.button = new PIXI.Sprite(this.normalTexture);
            this.button.anchor.set(0.5);
            this.button.position.set(this.width / 2, this.height / 2);
            this.addChild(this.button);
        }

        if (normalTextStyle) {
            this.normalTextStyle = normalTextStyle;
            this.hoveredTextStyle = hoveredTextStyle != null ? hoveredTextStyle : normalTextStyle;
            this.text = new PIXI.Text(text, this.normalTextStyle);
            this.text.anchor.set(0.5);
            this.addChild(this.text);    
        }
        
        this.clickCallback = null;
    }

    onClick(callback) {
        this.clickCallback = callback;
    }

    setButtonTexture(buttonTexture) {
        if (this.button) {
            this.button.texture = buttonTexture;
            this.dirty = true;
        }
    }
    updateTextStyle() {
        if (this.isOver) {
            this.setHoveredTextStyle();
        }
        else {
            this.setNormalTextStyle();
        }
    }

    setNormalTextStyle() {
        this.setTextStyle(this.normalTextStyle);
    }

    setHoveredTextStyle() {
        this.setTextStyle(this.hoveredTextStyle);
    }

    setTextStyle(textStyle) {
        if (this.text) {
            this.text.style = textStyle;
            this.text.dirty = true;
        }
    }

    onButtonDown() {
        this.isDown = true;
        this.setButtonTexture(this.pressedTexture);
    }

    onButtonUp() {
        this.isDown = false;
        this.setButtonTexture(this.normalTexture);

        this.updateTextStyle();
    }

    onButtonOver() {
        this.isOver = true;
        this.updateTextStyle();

        if (this.isDown) {
            this.setButtonTexture(this.pressedTexture);
        }
    }

    onButtonOut() {
        this.isOver = false;
        this.updateTextStyle();

        if (this.isDown) {
            this.setButtonTexture(this.normalTexture);
        }
    }

    onButtonClicked() {
        if (this.clickCallback) {
            this.clickCallback();
        }
    }
}