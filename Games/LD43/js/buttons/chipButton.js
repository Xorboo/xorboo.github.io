class ChipButton extends BaseTextButton {
    constructor(chip, onChipClickedCallback) {
        super(
            Params.textures.button.pixel,
            null,
            "???",
            Params.textStyle.chip,
            Params.textStyle.chipHover);
        this.button.alpha = 0.0;
        this.button.width = Params.chipButtonWidth;
        this.button.height = Params.chipButtonHeight;

        this.onClick(this.chipClicked);
        this.chipClickedCallback = onChipClickedCallback;
        
        if (chip) {
            this.setChip(chip);
        }
    }

    setChip(chip) {
        this.chip = chip;
        this.text.text = chip.text;
        this.setSacrificed(false);

        this.normalTextStyle = Params.textStyle.chip;
        this.hoveredTextStyle = Params.textStyle.chipHover;

        // Game over chip special coloring
        if (this.chip.gameOver) {
            this.normalTextStyle = this.hoveredTextStyle = Params.textStyle.chipLose;
        }
        this.updateTextStyle();
        this.text.alpha = 0;
    }

    getNextChip(bossIndex) {
        const evolveFunc = this.isSacrificed ? this.chip.onSacrifice : this.chip.onStay;
        return evolveFunc(bossIndex);
    }

    evolveChip(bossIndex) {
        let newChip = this.getNextChip(bossIndex);
        if (!newChip) {
            console.error("Failed in evolving chip on [" + bossIndex + "], was sacrificed: " + this.isSacrificed + ", data:");
            console.log(this.chip);
            newChip = chip;
        }
        this.setChip(newChip);

        SM.playItem();
    }

    chipClicked() {
        if (this.isSacrificed) {
            console.error("Chip is already sacrificed!");
            console.log(this);
            return;
        }

        this.setSacrificed(true);

        this.normalTextStyle = Params.textStyle.chipSacrificed;
        this.hoveredTextStyle = Params.textStyle.chipSacrificed;
        super.updateTextStyle();

        const chipDamage = 1;
        this.chipClickedCallback(chipDamage, this.chip);
    }

    setSacrificed(sacrificed) {
        this.isSacrificed = sacrificed;
        this.interactive = !sacrificed;
        if (sacrificed) {
            this.isOver = false;
        }
    }

    update(deltaTime) {
        if (this.text.alpha < 1) {
            this.text.alpha += deltaTime;
        }
    }
}