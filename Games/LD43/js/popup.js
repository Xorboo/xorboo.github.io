class Popup extends PIXI.Container {
    constructor() {
        super();

        const labelHeight = 50;

        const styles = [
            Params.textStyle.popupSmall,
            Params.textStyle.popupSacrificed,
            Params.textStyle.popupSmall,
            Params.textStyle.popupLarge,
        ];
        const labelsCount = styles.length;

        this.labels = new Array(labelsCount);
        for (let i = 0; i < labelsCount; ++i) {
            const label = new PIXI.Text("", styles[i]);
            label.anchor.set(0.5);
            label.position.set(0, labelHeight * (i - 2));
            this.addChild(label);
            this.labels[i] = label;
        }

        this.arraySprite = new PIXI.Sprite(Params.textures.arrow);
        this.arraySprite.anchor.set(0.5);
        this.arraySprite.scale.set(0.5);
        this.arraySprite.position.y += 5;
        this.arraySprite.tint = 0xfbf3cf;
        this.addChild(this.arraySprite);

        this.alpha = 0;
        this.enabled = false;
    }

    update(deltaTime) {
        if (!this.enabled) return;

        this.alpha -= 1 * deltaTime;
        this.enabled = 0 < this.alpha;
    }

    setText(text0, text1, text2, text3, isSacrifice, isGameOver) {
        this.labels[0].text = text0;
        this.labels[1].text = text1;
        this.labels[2].text = text2;
        this.labels[3].text = text3;

        this.labels[1].style = isSacrifice ? Params.textStyle.popupSacrificed : Params.textStyle.popupFulfilled;
        this.labels[3].style = isGameOver ? Params.textStyle.popupGameOver : Params.textStyle.popupLarge;

        this.arraySprite.visible = text3 != null;

        this.alpha = 2;
        this.enabled = true;
    }
}