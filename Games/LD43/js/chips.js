class Chip {
    constructor(text, onStay, onSacrifice, gameOver = false) {
        this.text = text;
        this.onStay = onStay;
        this.onSacrifice = onSacrifice;
        this.gameOver = gameOver;
    }
}

const GameData = {
    chips: {
        // Personal Life
        personalLife: new Chip(
            "Personal Life",
            bossIndex => {
                if (bossIndex === 0 ||
                    bossIndex === 3) {
                    return GameData.chips.relationship;
                } else {
                    return GameData.chips.personalLife;
                }
            },
            _ => GameData.chips.loneliness,
        ),

        loneliness: new Chip(
            "Loneliness",
            _ => GameData.chips.personalLife,
            _ => GameData.chips.depression,
        ),

        relationship: new Chip(
            "Relationship",
            _ => GameData.chips.family,
            _ => GameData.chips.depression,
        ),

        depression: new Chip(
            "Depression",
            bossIndex => {
                if (bossIndex === 2) {
                    return GameData.chips.deepGame;
                } else {
                    return GameData.chips.loneliness;
                }
            },
            _ => GameData.chips.leftGameDev,
        ),

        family: new Chip(
            "Family",
            _ => GameData.chips.children,
            _ => GameData.chips.depression,
        ),

        children: new Chip(
            "Children",
            _ => GameData.chips.happyRetirement,
            _ => GameData.chips.divorce,
        ),

        deepGame: new Chip(
            "Deep Themes in game",
            _ => GameData.chips.playersTears,
            _ => GameData.chips.gameWithoutSoul,
        ),

        leftGameDev: new Chip(
            "Left GameDev",
            null,
            null,
            true,
        ),

        divorce: new Chip(
            "Divorce",
        ),

        happyRetirement: new Chip(
            "Happy Retirement",
        ),

        playersTears: new Chip(
            "Player's tears",
        ),

        gameWithoutSoul: new Chip(
            "No Soul in game",
        ),

        // Social life
        socialLife: new Chip(
            "Social life",
            _ => GameData.chips.moreConnections,
            _ => GameData.chips.stopHikikomori,
        ),

        stopHikikomori: new Chip(
            "Stop being a hikikomori",
            _ => GameData.chips.socialLife,
            _ => GameData.chips.howTalkPeople,
        ),

        moreConnections: new Chip(
            "More connections",
            _ => GameData.chips.bizdevParty,
            _ => GameData.chips.findTimeForConnections,
        ),

        howTalkPeople: new Chip(
            "Learn talking to people",
            _ => GameData.chips.stopMisanthrope,
            _ => GameData.chips.feedCats,
        ),

        findTimeForConnections: new Chip(
            "Find time for connections",
            _ => GameData.chips.workCommunity,
            _ => GameData.chips.optimizeConnections,
        ),

        bizdevParty: new Chip(
            "Bizdev party",
            _ => GameData.chips.liverProblem,
            _ => GameData.chips.bizdevInfo,
        ),

        feedCats: new Chip(
            "Feed cats",
            _ => GameData.chips.strongIndependent,
            _ => GameData.chips.escapeFromCats,
        ),

        stopMisanthrope: new Chip(
            "Stop being a misanthrope",
            _ => GameData.chips.harassmentCharges,
            _ => GameData.chips.noWorkWithAnyone,
        ),

        optimizeConnections: new Chip(
            "Optimize connections",
            _ => GameData.chips.foundFriends,
            _ => GameData.chips.foundEnemies,
        ),

        workCommunity: new Chip(
            "Work with community",
            _ => GameData.chips.reviewBombing,
            _ => GameData.chips.fansLove,
        ),

        bizdevInfo: new Chip(
            "Lack of bizdev info",
            _ => GameData.chips.oldBuzzwords,
            _ => GameData.chips.portToNewDevice,
        ),

        liverProblem: new Chip(
            "Liver problems",
            _ => GameData.chips.alcoholAddiction,
            _ => GameData.chips.vegan,
        ),

        escapeFromCats: new Chip(
            "You have to escape from hungry cats",
        ),

        strongIndependent: new Chip(
            "Strong and independent developer",
        ),

        noWorkWithAnyone: new Chip(
            "Can't work with anyone",
        ),

        harassmentCharges: new Chip(
            "Have to deal with harassment charges",
        ),

        foundEnemies: new Chip(
            "Found some enemies",
        ),

        foundFriends: new Chip(
            "Found best friends",
        ),

        reviewBombing: new Chip(
            "Game review was bombed",
        ),

        fansLove: new Chip(
            "Fans love you",
        ),

        oldBuzzwords: new Chip(
            "Press-release is full of old buzz-words",
        ),

        portToNewDevice: new Chip(
            "Game was ported to new device",
        ),

        alcoholAddiction: new Chip(
            "Alcohol addiction",
        ),

        vegan: new Chip(
            "Became a vegan",
        ),

        // Healthy sleep
        healthySleep: new Chip(
            "Healthy sleep",
            boss => {
                return boss === 0
                    ? GameData.chips.dreamDiary
                    : GameData.chips.healthySleep;
            },
            _ => GameData.chips.sleepDeprivation,
        ),

        sleepDeprivation: new Chip(
            "Sleep Deprivation",
            _ => GameData.chips.healthySleep,
            _ => GameData.chips.migraine,
        ),

        dreamDiary: new Chip(
            "Keep a dream diary",
            _ => GameData.chips.alwaysDreaming,
            _ => GameData.chips.healthySleep,
        ),

        migraine: new Chip(
            "Migraine",
            _ => GameData.chips.sleepDeprivation,
            _ => GameData.chips.leftGameDev,
        ),

        alwaysDreaming: new Chip(
            "Never stop dreaming",
            _ => GameData.chips.stopFeatureCreeping,
            _ => GameData.chips.healthySleep,
        ),

        stopFeatureCreeping: new Chip(
            "Stop feature creeping",
            _ => GameData.chips.mediocreGame,
            _ => GameData.chips.projectWasCanceled,
        ),

        mediocreGame: new Chip(
            "Mediocre game",
        ),

        projectWasCanceled: new Chip(
            "Game was cancelled",
        ),

        // vacation
        vacation: new Chip(
            "Vacation",
            _ => GameData.chips.vacation,
            _ => GameData.chips.chronicFatigueSyndrome,
        ),

        chronicFatigueSyndrome: new Chip(
            "Chronic fatigue syndrome",
            _ => GameData.chips.vacation,
            _ => GameData.chips.neurosis,
        ),

        neurosis: new Chip(
            "Neurosis",
            _ => GameData.chips.chronicFatigueSyndrome,
            _ => GameData.chips.occupationalBurnout,
        ),

        occupationalBurnout: new Chip(
            "Occupational Burnout",
            null,
            null,
            true,
        ),

        // portfolio
        buildPortfolio: new Chip(
            "Build a portfolio",
            _ => GameData.chips.buildGoodPortfolio,
            _ => GameData.chips.shareWorks,
        ),

        shareWorks: new Chip(
            "Share your works",
            _ => GameData.chips.stopAddictedLikes,
            _ => GameData.chips.stopPerfectionist,
        ),

        buildGoodPortfolio: new Chip(
            "Build a good portfolio",
            _ => GameData.chips.buildBetterPortfolio,
            _ => GameData.chips.buildGoodPortfolio,
        ),

        stopPerfectionist: new Chip(
            "Stop perfectionism",
            _ => GameData.chips.howTradeOff,
            _ => GameData.chips.increaseQuality,
        ),

        stopAddictedLikes: new Chip(
            "Stop being a likes addict",
            _ => GameData.chips.freelancing,
            _ => GameData.chips.patreon,
        ),

        buildBetterPortfolio: new Chip(
            "Build a better portfolio",
            _ => GameData.chips.buildSuitablePortfolio,
            _ => GameData.chips.buildBetterPortfolio,
        ),

        increaseQuality: new Chip(
            "Increase game quality",
            _ => GameData.chips.developmentHell,
            _ => GameData.chips.forgetTheGame,
        ),

        howTradeOff: new Chip(
            "Teach people how to trade-off",
            _ => GameData.chips.peoplePerfectionism,
            _ => GameData.chips.peoplePerfectionism,
        ),

        patreon: new Chip(
            "Start patreon",
            _ => GameData.chips.becomeCosplayer,
            _ => GameData.chips.becomeBlogger,
        ),

        freelancing: new Chip(
            "Start freelancing",
            _ => GameData.chips.leftForFreelance,
            _ => GameData.chips.hateOfficeWork,
        ),

        buildSuitablePortfolio: new Chip(
            "Build an suitable portfolio",
            _ => GameData.chips.receiveJobInvitation,
            _ => GameData.chips.continueCurrentJob,
        ),

        forgetTheGame: new Chip(
            "You want to forget",
        ),

        developmentHell: new Chip(
            "Game has fallen into development hell",
        ),

        peoplePerfectionism: new Chip(
            "People are still perfectionists",
        ),

        becomeBlogger: new Chip(
            "Became a blogger",
        ),

        becomeCosplayer: new Chip(
            "Became a cosplayer",
        ),

        hateOfficeWork: new Chip(
            "Hate office work",
        ),

        leftForFreelance: new Chip(
            "Left the job for freelance",
        ),

        continueCurrentJob: new Chip(
            "Working at the current job",
        ),

        receiveJobInvitation: new Chip(
            "Received a great job offer",
        ),

        // gamejam
        gamejam: new Chip(
            "Participate in gamejams",
            _ => GameData.chips.stopWork7,
            _ => GameData.chips.startPet,
        ),

        startPet: new Chip(
            "Start a pet-project",
            _ => GameData.chips.addBattleRoyale,
            _ => GameData.chips.findForPet,
        ),

        stopWork7: new Chip(
            "Stop working 7 days a week",
            _ => GameData.chips.useFreeTime,
            _ => GameData.chips.beatWorkaholism,
        ),

        findForPet: new Chip(
            "Find people for pet-project",
            _ => GameData.chips.manageSideTeam,
            _ => GameData.chips.escapeFromPet,
        ),

        addBattleRoyale: new Chip(
            "Add battle-royale to pet-project",
            _ => GameData.chips.addBlockchain,
            _ => GameData.chips.addBattle,
        ),

        beatWorkaholism: new Chip(
            "Beat the workaholism",
            _ => GameData.chips.stopProcrastination,
            _ => GameData.chips.occupationalBurnout,
        ),

        useFreeTime: new Chip(
            "Start using free time somehow",
            _ => GameData.chips.courses,
            _ => GameData.chips.stopWatchingCeiling,
        ),

        escapeFromPet: new Chip(
            "Escape from another's pet-project",
            _ => GameData.chips.sayNo,
            _ => GameData.chips.underestimated,
        ),

        manageSideTeam: new Chip(
            "Manage a side team of amateurs",
            _ => GameData.chips.ownTeam,
            _ => GameData.chips.everyoneAmateurs,
        ),

        addBattle: new Chip(
            "Add at least battles to pet-project",
            _ => GameData.chips.petBattle,
            _ => GameData.chips.returnToPet,
        ),

        addBlockchain: new Chip(
            "Add blockchain to pet-project",
            _ => GameData.chips.howTradeOff,
            _ => GameData.chips.blockchainWallet,
        ),

        stopWatchingCeiling: new Chip(
            "Stop looking at ceiling all weekends",
            _ => GameData.chips.eyesWeekends,
            _ => GameData.chips.ceilingLooking,
        ),

        courses: new Chip(
            "Sign up for courses",
            _ => GameData.chips.knowNothing,
            _ => GameData.chips.knowSomething,
        ),

        stopProcrastination: new Chip(
            "Stop procrastinating",
            _ => GameData.chips.stillWorkaholic,
            _ => GameData.chips.youFired,
        ),

        underestimated: new Chip(
            "You're underestimated",
        ),

        sayNo: new Chip(
            "Learned saying NO",
        ),

        everyoneAmateurs: new Chip(
            "See everyone as amateurs",
        ),

        ownTeam: new Chip(
            "You have your own team",
        ),

        returnToPet: new Chip(
            "You'll return to pet-project someday",
        ),

        petBattle: new Chip(
            "Pet-project with battles",
        ),

        blockchainWallet: new Chip(
            "Blockchain wallet",
        ),

        worldOfTrading: new Chip(
            "You collide with the world of trading",
        ),

        ceilingLooking: new Chip(
            "Ceiling started looking at you",
        ),

        eyesWeekends: new Chip(
            "You don't open your eyes all weekends",
        ),

        knowSomething: new Chip(
            "You know something",
        ),

        knowNothing: new Chip(
            "You know nothing",
        ),

        youFired: new Chip(
            "You're fired",
        ),

        stillWorkaholic: new Chip(
            "You are still a workaholic",
        ),

        // readmore
        readMore: new Chip(
            "Read more",
            _ => GameData.chips.fromBook,
            _ => GameData.chips.wtos,
        ),

        wtos: new Chip(
            "Combine words into sentences",
            _ => GameData.chips.readMore,
            _ => GameData.chips.ctow,
        ),

        fromBook: new Chip(
            "Get inspiration from books",
            _ => GameData.chips.strongPlot,
            _ => GameData.chips.pornPlot,
        ),

        ctow: new Chip(
            "Combine characters into words",
            _ => GameData.chips.noSayShow,
            _ => GameData.chips.wtos,
        ),

        pornPlot: new Chip(
            "Make plot not like in porn",
            _ => GameData.chips.forChildren,
            _ => GameData.chips.adultGame,
        ),

        strongPlot: new Chip(
            "Make a strong plot",
            _ => GameData.chips.pilesText,
            _ => GameData.chips.crossMedia,
        ),

        noSayShow: new Chip(
            "Not to say, but show",
            _ => GameData.chips.buildTheories,
            _ => GameData.chips.bessWordLess,
        ),

        adultGame: new Chip(
            "Make adult-game",
            _ => GameData.chips.neverTellJob,
            _ => GameData.chips.pornBaron,
        ),

        forChildren: new Chip(
            "Make a game for children",
            _ => GameData.chips.childrenHate,
            _ => GameData.chips.adultsLike,
        ),

        pilesText: new Chip(
            "Remove piles of text",
            _ => GameData.chips.nobodyPlot,
            _ => GameData.chips.wiki,
        ),
        crossMedia: new Chip(
            "Cross-media project",
            _ => GameData.chips.uweBoll,
            _ => GameData.chips.newBookSeries,
        ),

        buildTheories: new Chip(
            "Players are building theories",
        ),

        bessWordLess: new Chip(
            "Best word-less expirence",
        ),

        neverTellJob: new Chip(
            "Can't tell anyone about your job",
        ),

        pornBaron: new Chip(
            "Became a porn baron",
        ),

        childrenHate: new Chip(
            "Children hate your game",
        ),

        adultsLike: new Chip(
            "Adults like your game",
        ),

        nobodyPlot: new Chip(
            "Nobody knows plot of the game",
        ),

        wiki: new Chip(
            "Fans created wiki",
        ),

        uweBoll: new Chip(
            "Uwe Boll adopted your game",
        ),

        newBookSeries: new Chip(
            "New books are inspired by your game",
        ),

        activeRest: new Chip(
            "Active rest",
            _ => GameData.chips.activeRest,
            _ => GameData.chips.visitDoctor,
        ),

        visitDoctor: new Chip(
            "Visit a doctor",
            _ => GameData.chips.takeMedication,
            _ => GameData.chips.leftGameDev,
        ),

        takeMedication: new Chip(
            "Take medication",
            _ => GameData.chips.activeRest2,
            _ => GameData.chips.leftGameDev,
        ),

        activeRest2: new Chip(
            "Active rest",
            _ => GameData.chips.activeRest2,
            _ => GameData.chips.leftGameDev,
        ),
    },
    handChipsCount: 8,
    
    bosses: [
        { health: 4, spriteId: 0, hint: "Education" },
        { health: 3, spriteId: 1, hint: "Pre-production" },
        { health: 6, spriteId: 0, hint: "Development" },
        { health: 5, spriteId: 1, hint: "Marketing and release" },
    ],

    shuffle: function (a) {
        var j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    },

    handChips: function () {
        let chipsOnHand = [
            this.chips.personalLife,
            this.chips.socialLife,
            this.chips.healthySleep,
            this.chips.vacation,
            this.chips.buildPortfolio,
            this.chips.gamejam,
            this.chips.readMore,
            this.chips.activeRest,
        ];
        return this.shuffle(chipsOnHand);
    },

    getInitialChips: function () {
        let initialChips = GameData.handChips().slice();

        for (let i = initialChips.length; i < GameData.handChipsCount; ++i) {
            const name = "Chip #" + i.toString();
            initialChips.push(new Chip(
                name,
                _ => GetChip(name, false, 0),
                _ => GetChip(name, true, 0)
            ));
        }

        function GetChip(parentName, isSacrifice, bossIndex) {
            if (bossIndex == GameData.bosses.length) {
                return null;
            }
            const name = parentName + (isSacrifice ? '-' : '+');
            return new Chip(
                name,
                _ => GetChip(name, false, bossIndex + 1),
                _ => GetChip(name, true, bossIndex + 1)
            );
        }

        return initialChips;
    }
}