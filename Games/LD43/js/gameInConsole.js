let currentState = null;

const chipsOnHand = GameData.getInitialChips();

const chipsButtons = new Array(chipsOnHand.length);

const mainLabelElement = document.getElementById("test_output");
mainLabelElement.innerHTML = "";

const continueButtonElement = document.createElement("BUTTON");
document.body.appendChild(continueButtonElement);
continueButtonElement.appendChild(document.createTextNode("Continue"));
continueButtonElement.addEventListener("click", function() {
    if (currentState != null) {
        currentState();
    }
});

const bosses = [
    // new Boss(6),
    // new Boss(8),
    // new Boss(12),
    // new Boss(10),
    
    new Boss(1),
    new Boss(2),
    new Boss(4),
    new Boss(3),
];


let currentBossIndex = 0;

initState();

function printText(text) {
    mainLabelElement.innerHTML += text;
    mainLabelElement.innerHTML += "<br/>";
}

function initState() {
    printText("Welcome! Press 'continue' to get your chips.");
    currentState = generateChipsButtons;
}

function generateChipsButtons() {
    printText("You've got your chip. Press 'Continue'.");
    for (let i = 0, n = chipsOnHand.length; i < n; ++i) {
        let chip = chipsOnHand[i];
        let buttonElement = document.createElement("BUTTON");
        document.body.appendChild(buttonElement);
        buttonElement.disabled = true;
        
        var label = document.createTextNode(chip.text);
        buttonElement.appendChild(label);
        buttonElement.addEventListener("click", function() {
            const b = chipsButtons[i];
            printText("Your sacrifice: " + b.chip.text);
            b.button.disabled = true;
            b.sacrificed = true;
            bosses[currentBossIndex].health -= 1;
            currentState();
        });

        chipsButtons[i] = {
            chip: chip,
            button: buttonElement,
            sacrificed: false,
        };
    }
    currentState = initBoss;
}

function initBoss() {
    printText("Battle with boss #" + (currentBossIndex + 1));
    continueButtonElement.disabled = true;
    for (let i = 0, n = chipsButtons.length; i < n; ++i) {
        chipsButtons[i].button.disabled = false;
    }
    bossLoop();
}

function bossLoop() {
    if (0 < bosses[currentBossIndex].health) {
        printText("Boss health: " + bosses[currentBossIndex].health);
        currentState = bossLoop;
    } else {
        printText("Victory!");
        for (let i = 0, n = chipsButtons.length; i < n; ++i) {
            chipsButtons[i].button.disabled = true;
        }
        continueButtonElement.disabled = false;
        currentState = bossResult;
    }
}

function bossResult() {
    printText("Results:");
    let isGameOver = null;
    for (let i = 0, n = chipsButtons.length; i < n; ++i) {
        const chipButton = chipsButtons[i];
        const previousChip = chipButton.chip;
        let newChip;
        if (chipButton.sacrificed) {
            newChip = chipButton.chip.onSacrifice(0);
            chipButton.sacrificed = false;
            isGameOver = isGameOver || newChip.gameOver;
        } else {
            newChip = chipButton.chip.onStay(0);
        } 
        printText(previousChip.text + " => " + newChip.text);
        chipButton.button.innerHTML = newChip.text;
        chipButton.chip = newChip;
    }
    if (isGameOver) {
        currentState = badEnding;
    } else {
        currentState = nextBoss;
    }
}

function nextBoss() {
    ++currentBossIndex;
    if (currentBossIndex == bosses.length) {
        printText("Game shipped!");
        currentState = gameOver;
    } else {
        printText("Next battle!");
        currentState = initBoss;
    }
}

function badEnding() {
    printText("Bad Ending!");
    continueButtonElement.disabled = true;
    for (let i = 0, n = chipsButtons.length; i < n; ++i) {
        chipsButtons[i].button.disabled = true;
    }
}

function gameOver() {
    printText("Game over!");
    continueButtonElement.disabled = true;
    for (let i = 0, n = chipsButtons.length; i < n; ++i) {
        chipsButtons[i].button.disabled = true;
    }
}
