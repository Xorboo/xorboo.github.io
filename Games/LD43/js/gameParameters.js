const Params = {
    application: {
        width: 800,
        height: 600,
        backgroundColor: 0x6a717e
    },

    sceneType: {
        START: 1,
        MAIN: 2,
        FAIL: 3,
        FINISH: 4
    },

    hintDelay: 3,

    shiftSpeed: 300,
    chipEvolvePause: 2,
    extraWalkTime: 1,
    introWalkTime: 3,
    levelHeaderUpdateDelay: -1,
    bossAttackSoundDelay: 0.7,
    bossDeathSoundDelay: 0.5,
    hitSoundDelay: 0.2,
    afterKillDelay: 1.0,
    gameLosePause: 0.8,
    gameWinPause: 0.8,
    bossIndexUpdatePause: -1,

    stepPeriod: 4 / 12,      // every 4 frames
    animationSpeed: 1 / 5,   // 12 fps
    downscaleFactor: 0.687,

    chipButtonWidth: 280,
    chipButtonHeight: 28,

    textStyle: {
        bossHint: new PIXI.TextStyle({
            fontFamily: "Deutsch",
            fontSize: 26,
            fill: "#666666",
            stroke: "white",
            strokeThickness: 4,
            align: "center"
        }),

        credits: new PIXI.TextStyle({
            fontFamily: "fighting_spirit_PG_ital",
            fontSize: 22,
            fill: "#e53500",
            align: "center"
        }),
        creditsHover: new PIXI.TextStyle({
            fontFamily: "fighting_spirit_PG_ital",
            fontSize: 24,
            fill: "#e53500",
            stroke: "white",
            strokeThickness: 4,
            align: "left",
        }),

        failHeader: new PIXI.TextStyle({
            fontFamily: "fighting_spirit_PG_ital",
            fontSize: 50,
            fill: "#e53500",
            align: "center"
        }),
        failDescription: new PIXI.TextStyle({
            fontFamily: "fighting_spirit_PG_ital",
            fontSize: 36,
            fill: "#fcf4e6",
        }),

        finishHeader: new PIXI.TextStyle({
            fontFamily: "fighting_spirit_PG_ital",
            fontSize: 50,
            fill: "#e53500",
            stroke: "black",
            strokeThickness: 4,
            align: "center"
        }),
        finishHint: new PIXI.TextStyle({
            fontFamily: "fighting_spirit_PG_ital",
            fontSize: 40,
            fill: "#e53500",
            align: "center"
        }),
        finishChip: new PIXI.TextStyle({
            fontFamily: "fighting_spirit_PG_ital",
            fontSize: 18,
            fill: "#fcf4e6",
            align: "center"
        }),
        finishChipBad: new PIXI.TextStyle({
            fontFamily: "fighting_spirit_PG_ital",
            fontSize: 22,
            fill: "#c37f7f",
            align: "center"
        }),

        introText: new PIXI.TextStyle({
            fontFamily: "Deutsch",
            fontSize: 32,
            fill: "black",
            align: "center"
        }),
        hintText: new PIXI.TextStyle({
            fontFamily: "Deutsch",
            fontSize: 32,
            fill: "black",
            align: "center",
            stroke: "white",
            strokeThickness: 4,
        }),
        levelHeader: new PIXI.TextStyle({
            fontFamily: "DeathtoMetal",
            fontSize: 36,
            fill: "black"
        }),
        sacrificeSmall: new PIXI.TextStyle({
            fontFamily: "Deutsch",
            fontSize: 18,
            fill: "black"
        }),
        sacrifice: new PIXI.TextStyle({
            fontFamily: "Plain_Germanica",
            fontSize: 24,
            fill: "black"
        }),
        chip: new PIXI.TextStyle({
            fontFamily: "Deutsch",
            fontSize: 20,
            fill: "black"
        }),
        chipHover: new PIXI.TextStyle({
            fontFamily: "Deutsch",
            fontSize: 20,
            fill: "black",
            stroke: "red",
            strokeThickness: 4,
        }),
        chipSacrificed: new PIXI.TextStyle({
            fontFamily: "Deutsch",
            fontSize: 20,
            fill: "#990000"
        }),
        chipLose: new PIXI.TextStyle({
            fontFamily: "Deutsch",
            fontSize: 28,
            fill: "#661111",
            stroke: "black",
            strokeThickness: 2,
        }),
        popupSmall: new PIXI.TextStyle({
            fontFamily: "Deutsch",
            fontSize: 30,
            fill: "white",
            stroke: "black",
            strokeThickness: 10,
            align: "center",
        }),
        popupLarge: new PIXI.TextStyle({
            fontFamily: "Deutsch",
            fontSize: 50,
            fill: "white",
            stroke: "black",
            strokeThickness: 10,
            align: "center",
        }),
        popupSacrificed: new PIXI.TextStyle({
            fontFamily: "Deutsch",
            fontSize: 50,
            fill: "#DDDDDD",
            stroke: "#660000",
            strokeThickness: 10,
            align: "center",
        }),
        popupFulfilled: new PIXI.TextStyle({
            fontFamily: "Deutsch",
            fontSize: 50,
            fill: "white",
            stroke: "#006600",
            strokeThickness: 10,
            align: "center",
        }),
        popupGameOver: new PIXI.TextStyle({
            fontFamily: "Deutsch",
            fontSize: 70,
            fill: "#661111",
            stroke: "black",
            strokeThickness: 10,
            align: "center",
        }),
    },

    textures: {
        background: {
            tilingWall: PIXI.Texture.fromImage('assets/backgrounds/Game_Wall.png'),
            tilingFloor: PIXI.Texture.fromImage('assets/backgrounds/Game_floor.png'),
            gameUI: PIXI.Texture.fromImage('assets/backgrounds/ui_bg.png'),
            levelNumber: PIXI.Texture.fromImage('assets/backgrounds/Plashka_LevelNumber.png'),
            gameOver: PIXI.Texture.fromImage('assets/backgrounds/GameOver_miniText.png'),
            gameWin: PIXI.Texture.fromImage('assets/backgrounds/GameWin_bigText.png'),
        },
        button: {
            pixel: "assets/buttons/pixel.png",
        },
        intro: {
            textPanel: PIXI.Texture.fromImage("assets/backgrounds/Background_screen1_Panel.png"),
            hero: PIXI.Texture.fromImage("assets/backgrounds/Backgrouns_screen1_start_Rudolf.png"),
            torchBase: PIXI.Texture.fromImage("assets/backgrounds/Backgrouns_screen1_Torch.png"),
            bg: [
                "assets/backgrounds/Background_screen1_start.png",
                "assets/backgrounds/Backgrouns_screen1_closed_door.png",
                "assets/backgrounds/Backgrouns_screen1.png"
            ]
        },
        heart: PIXI.Texture.fromImage("assets/textures/heart.png"),
        arrow: PIXI.Texture.fromImage("assets/textures/arrow_down.png"),
    },

    sounds: {
        bgMusic: "assets/music/LD43_Music.mp3",
        button1: "assets/sounds/Button_1.wav",
        button2: "assets/sounds/Button_2.wav",
        bossDeath: "assets/sounds/Monster_die.wav",
        gameOver: "assets/sounds/Dark_lose.wav",
        win: "assets/sounds/Win.wav",
        fire: "assets/sounds/Fire.wav",
        door: "assets/sounds/Door_creak.wav",
        item: "assets/sounds/Item_change.wav",
        steps: new SoundPack("step_", 6),
        doDamage: new SoundPack("dmg_", 4),
        takeDamage: new SoundPack("take_dmg_", 2)
    },

    text: {
        button_start: "GO",
        button_restart: "RESTART"
    },

    atlases: {
        bosses: [
            {
                attack: "assets/atlases/boss/1/Boss_Attack.json",
                hit: "assets/atlases/boss/1/Boss_Hit.json",
                idle: "assets/atlases/boss/1/Boss_Idle.json",
                die: "assets/atlases/boss/1/Boss_Dead.json"
            },
            {
                attack: "assets/atlases/boss/2/Boss_Attack.json",
                hit: "assets/atlases/boss/2/Boss_Hit.json",
                idle: "assets/atlases/boss/2/Boss_Idle.json",
                die: "assets/atlases/boss/2/Boss_Dead.json"
            }
        ],
        hero: {
            idle: "assets/atlases/hero/Rudolf_Idle.json",
            run: "assets/atlases/hero/Rudolf_Run.json"
        },
        torch: "assets/atlases/FireTorch.json",
        flashFx: "assets/atlases/Flash_Fx.json",
        replay: "assets/atlases/Buton_Replay.json",
    },

    credits: [
        ["@Xorboo", "https://twitter.com/Xorboo"],
        ["@nec_neca", "https://twitter.com/nec_neca"],
        //["@Mazokpixels", "https://twitter.com/Mazokpixels"],
        ["@GerodruS", "https://twitter.com/GerodruS"],
        ["@NikolsaNNN", "https://twitter.com/NikolsaNNN"]
    ]
}
