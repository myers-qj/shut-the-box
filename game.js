// Constants
const dice1 = document.getElementById("dice1");
const dice2 = document.getElementById("dice2");
const rollButton = document.getElementById("roll-btn");
const individualDiceButton = document.getElementById("individual-dice-btn");
const sumDiceButton = document.getElementById("sum-dice-btn");
const endTurnButton = document.getElementById("end-turn-btn");
const startButton = document.getElementById("start-btn");
const player1Input = document.getElementById("p1");
const player2Input = document.getElementById("p2");
const boxes = Array.from(document.querySelectorAll(".box"));
const diceSumElement = document.getElementById("dice-sum");
const turnElement = document.getElementById("turn");
const roundElement = document.getElementById("round");
const scorecard = document.getElementById("scorecard-table");
const scoreP1 = {
  round1: document.getElementById("player1-round1"),
  round2: document.getElementById("player1-round2"),
  round3: document.getElementById("player1-round3"),
  round4: document.getElementById("player1-round4"),
  round5: document.getElementById("player1-round5"),
  total: document.getElementById("player1-total")
};
const scoreP2 = {
  round1: document.getElementById("player2-round1"),
  round2: document.getElementById("player2-round2"),
  round3: document.getElementById("player2-round3"),
  round4: document.getElementById("player2-round4"),
  round5: document.getElementById("player2-round5"),
  total: document.getElementById("player2-total")
};
const winnerSection = document.getElementById("winner-section");
const winnerDeclaration = document.getElementById("winner-declaration");


// Global Variables
let boxesState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let currentPlayer = 1;
let currentRound = 1;
let die1 = 0;
let die2 = 0;
let player1Points = [0, 0, 0, 0, 0];
let player2Points = [0, 0, 0, 0, 0];

// Functions
function resetBoard() {
    boxesState.fill(0);
    boxes.forEach((box, index) => {
        box.textContent = index + 1;
        box.classList.remove("shut");
        box.dataset.lid = "open";
    });
}

function shut(boxNumber) {
    const box = document.getElementById(`box${boxNumber}`);
    box.classList.add("shut");
    box.textContent = "X";
    boxesState[boxNumber] = "X";
}

function rollDice() {
    die1 = Math.floor(Math.random() * 6) + 1;
    die2 = Math.floor(Math.random() * 6) + 1;
    dice1.className = `bi bi-dice-${die1}`;
    dice2.className = `bi bi-dice-${die2}`;
    const sum = die1 + die2;
    diceSumElement.textContent = `Dice Sum: ${sum}`;
    updateButtonStates(sum);
}

function updateButtonStates(sum) {
    const isIndividualValid = die1 !== die2 && boxesState[die1] !== "X" && boxesState[die2] !== "X";
    const isSumValid = sum <= 9 && boxesState[sum] !== "X";
    individualDiceButton.disabled = !isIndividualValid;
    sumDiceButton.disabled = !isSumValid;
    endTurnButton.disabled = isIndividualValid || isSumValid;
    rollButton.disabled = true;
}

function handleIndividualDice() {
    shut(die1);
    shut(die2);
    boxesState[0] += die1 + die2;
    resetButtons();
}

function handleSumDice() {
    const sum = die1 + die2;
    shut(sum);
    boxesState[0] += sum;
    resetButtons();
}

function resetButtons() {
    individualDiceButton.disabled = true;
    sumDiceButton.disabled = true;
    rollButton.disabled = false;
}

function endTurn() {
    const pointsForThisTurn = 45 - boxesState[0];
    if (currentPlayer === 1) {
        player1Points[currentRound - 1] = pointsForThisTurn;
        scoreP1[`round${currentRound}`].textContent = pointsForThisTurn;
        currentPlayer = 2;
        turnElement.textContent = "Player 2's Turn";
    } else {
        player2Points[currentRound - 1] = pointsForThisTurn;
        scoreP2[`round${currentRound}`].textContent = pointsForThisTurn;
        currentPlayer = 1;
        turnElement.textContent = "Player 1's Turn";
        currentRound++;
        roundElement.textContent = `Round: ${currentRound}`;
        if (currentRound > 5) {
            gameOver();
            return;
        }
    }
    updateTotalScores();
    resetBoard();
    endTurnButton.disabled = true;
    rollButton.disabled = false;
}

function updateTotalScores() {
    scoreP1.total.textContent = player1Points.reduce((a, b) => a + b, 0);
    scoreP2.total.textContent = player2Points.reduce((a, b) => a + b, 0);
}

function gameOver() {
    const winner = player1Points.reduce((a, b) => a + b, 0) < player2Points.reduce((a, b) => a + b, 0) ? "Player 1" : "Player 2";
    winnerDeclaration.textContent = `Winner: ${winner}!`;
    winnerSection.style.display = "block";
    document.getElementById("board-section").style.display = "none";
    document.getElementById("dice-section").style.display = "none";
    document.getElementById("scorecard-section").style.display = "none";
}

// Event Listeners
startButton.addEventListener("click", () => {
    const player1Name = player1Input.value.trim();
    const player2Name = player2Input.value.trim();
    if (!player1Name || !player2Name) {
        alert("Both player names are required!");
        return;
    }
    resetBoard();
    document.getElementById("players-section").style.display = "none";
    document.getElementById("board-section").style.display = "block";
    document.getElementById("dice-section").style.display = "block";
    document.getElementById("scorecard-section").style.display = "block";
    rollButton.disabled = false;
});

rollButton.addEventListener("click", rollDice);
individualDiceButton.addEventListener("click", handleIndividualDice);
sumDiceButton.addEventListener("click", handleSumDice);
endTurnButton.addEventListener("click", endTurn);

