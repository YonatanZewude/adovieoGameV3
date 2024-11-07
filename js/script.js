// Global variable for image paths
const imagePaths = {
  blueberry: "https://content.adoveodemo.com/1729499244809_1.png",
  strawberry: "https://content.adoveodemo.com/1729499250486_2.png",
  apple: "https://content.adoveodemo.com/1729499256359_3.png",
  banana: "https://content.adoveodemo.com/1729499262545_4.png",
  mango: "https://content.adoveodemo.com/1729499268469_5.png",
  pineapple: "https://content.adoveodemo.com/1729499274774_6.png",
  watermelon: "https://content.adoveodemo.com/1729499281547_7.png",
  drink: "https://content.adoveodemo.com/1729499295834_8.png",
};

// Array with all image paths for the game

const emojiSequence = [
  imagePaths.blueberry,
  imagePaths.strawberry,
  imagePaths.apple,
  imagePaths.banana,
  imagePaths.mango,
  imagePaths.pineapple,
  imagePaths.watermelon,
  imagePaths.drink,
];

// Score values for each image
const scoreValues = {
  [imagePaths.blueberry]: 1,
  [imagePaths.strawberry]: 2,
  [imagePaths.apple]: 3,
  [imagePaths.banana]: 4,
  [imagePaths.mango]: 5,
  [imagePaths.pineapple]: 6,
  [imagePaths.watermelon]: 7,
  [imagePaths.drink]: 9,
};

const totalCells = 25;
const MaxMovesAndGoalScore = 20;

let board = document.getElementById("board");
let score = 0;
let moves = MaxMovesAndGoalScore;
let draggedElement = null;
let originalContent = "";
let originalCell = null;
let touchElement = null;
let placeholder = null;
let gameMode = "Version1"; // Default version
const fillCountOnLastImageMatch = 3;

const scoreDisplay = document.getElementById("score");
const movesDisplay = document.getElementById("moves");
const goalsSection = document.getElementById("goalsSection");
const movesSection = document.getElementById("movesSection");

// const moveButton = document.getElementById("Limited_number_of_moves");
// moveButton.addEventListener("click", () => {
//   gameMode = "Version 1";
//   resetGameVersion1();
// });

// const scoreButton = document.getElementById("Unlimited_number_of_moves");
// scoreButton.addEventListener("click", () => {
//   gameMode = "Version2";
//   initVersion2();
// });

const version3_1Button = document.getElementById("Version3_1Button");
const version3_2Button = document.getElementById("Version3_2Button");
const version1Button = document.getElementById("Version1Button");
const version2Button = document.getElementById("Version2Button");

version1Button.addEventListener("click", resetGameVersion1);
version2Button.addEventListener("click", initVersion2);
version3_1Button.addEventListener("click", initVersion3_1);
version3_2Button.addEventListener("click", initVersion3_2);

function resetGameVersion1() {
  gameMode = "Version1";
  score = 0;
  moves = MaxMovesAndGoalScore;
  scoreDisplay.textContent = score;
  movesDisplay.textContent = moves;

  movesSection.style.display = "block";
  goalsSection.style.display = "none";
  console.log("Aktiv version: Version 1");

  createBoard();
}

function initVersion2() {
  gameMode = "Version2";
  score = 0;
  moves = Infinity;

  movesSection.style.display = "none";
  goalsSection.style.display = "block";

  scoreDisplay.textContent = score;
  // document.getElementById("progress-bar").style.width = "0%";
  console.log("Aktiv version: Version 2");

  createBoard();
}

// Initiera Version 3.1
function initVersion3_1() {
  gameMode = "Version3_1";
  score = 0;
  moves = MaxMovesAndGoalScore;

  movesSection.style.display = "block";
  goalsSection.style.display = "none";

  scoreDisplay.textContent = score;
  movesDisplay.textContent = moves;
  console.log("Aktiv version: Version 3,1");
  createBoard();
}

// Initiera Version 3.2
function initVersion3_2() {
  gameMode = "Version3_2";
  score = 0;
  moves = Infinity;

  movesSection.style.display = "none";
  goalsSection.style.display = "block";

  scoreDisplay.textContent = score;
  console.log("Aktiv version: Version 3,2");
  createBoard();
}

function switchGameMode() {
  if (gameMode === "Version 1") {
    initVersion2();
    gameMode = "Version2";
  } else {
    resetGameVersion1();
    gameMode = "Version 1";
  }
}

const nrOfGols = document.getElementById("goalsSection");
nrOfGols.innerHTML = "Goals: " + MaxMovesAndGoalScore + " " + "score";
const nrOfMoves = document.getElementById("moves");
nrOfMoves.innerHTML = MaxMovesAndGoalScore;

if (gameMode === "Version1") {
  nrOfGols.style.display = "none";
} else {
  nrOfGols.style.display = "block";
}
// Create game board with random images in each cell
function createBoard() {
  board.innerHTML = "";

  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    //cell.setAttribute("draggable", true);
    const imgElement = document.createElement("img");

    imgElement.src = getRandomEmoji();
    cell.appendChild(imgElement);
    board.addEventListener("dragstart", handleDragStart);
    board.addEventListener("dragover", handleDragOver);
    board.addEventListener("drop", handleDrop);
    board.addEventListener("dragend", handleDragEnd);

    board.addEventListener("touchstart", handleTouchStart, { passive: true });
    board.addEventListener("touchmove", handleTouchMove, { passive: true });
    board.addEventListener("touchend", handleTouchEnd), { passive: true };

    board.appendChild(cell);
  }
}

function checkGameOver() {
  if ((gameMode === "Version1" || gameMode === "Version3_1") && moves <= 0) {
    showModal(
      `Game Over! You scored ${score} points in ${MaxMovesAndGoalScore} moves. Try again!`
    );
  } else if (
    (gameMode === "Version2" || gameMode === "Version3_2") &&
    score >= MaxMovesAndGoalScore
  ) {
    showModal(`Congratulations! You reached ${score} points and won the game!`);
  }
}

function showModal(message) {
  const modal = document.getElementById("gameModal");
  document.getElementById("modalMessage").textContent = message;
  modal.style.display = "block";
}

function hideModal() {
  document.getElementById("gameModal").style.display = "none";
  location.reload();
}

function handleDragStart(event) {
  draggedElement = event.target.closest(".cell");
  originalContent = draggedElement.querySelector("img").src;
  originalCell = draggedElement;
  event.dataTransfer.setData("text/plain", originalContent);
  draggedElement.classList.add("dragging");
}

function handleDragOver(event) {
  event.preventDefault();
}
function handleDrop(event) {
  event.preventDefault();

  removeAllMatchedClasses();

  const draggedEmoji = event.dataTransfer.getData("text/plain");
  const targetCell = event.target.closest(".cell");

  // If no target cell is found, return the emoji to the original cell
  if (!targetCell) {
    returnEmojiToOriginalCell();
    return;
  }

  const targetEmoji = targetCell.querySelector("img").src;
  const draggedEmojiFile = draggedEmoji.split("/").pop();
  const targetEmojiFile = targetEmoji.split("/").pop();

  if (draggedEmojiFile === targetEmojiFile && draggedElement !== targetCell) {
    // Om matchning sker
    incrementScore(draggedEmoji);
    moves--;
    movesDisplay.textContent = moves;

    // Kontrollera om spelet är i Version 1 eller Version 2
    if (gameMode === "Version1" || gameMode === "Version2") {
      const nextEmojis = getNextTwoEmojis(draggedEmoji);
      originalCell.querySelector("img").src = nextEmojis[0];
      targetCell.querySelector("img").src = nextEmojis[1];
    } else {
      originalCell.querySelector("img").src = "";
      targetCell.querySelector("img").src =
        getNextEmojiInSequence(draggedEmoji);

      if (draggedEmojiFile === imagePaths.drink.split("/").pop()) {
        fillEmptyCells(fillCountOnLastImageMatch);
      }
    }

    draggedElement.classList.add("matched");
    targetCell.classList.add("matched");

    draggedElement.addEventListener("animationend", removeMatchedClass);
    draggedElement.addEventListener("transitionend", removeMatchedClass);
    targetCell.addEventListener("animationend", removeMatchedClass);
    targetCell.addEventListener("transitionend", removeMatchedClass);

    checkGameOver();
  } else {
    // Återställ om ingen matchning sker
    returnEmojiToOriginalCell();
  }
}

function fillEmptyCells(fillCount) {
  const emptyCells = Array.from(document.querySelectorAll(".cell img[src='']"));
  const cellsToFill = emptyCells.slice(0, fillCount);
  cellsToFill.forEach((cell) => {
    cell.src = getRandomEmoji();
  });
}

function getNextEmojiInSequence(matchedEmoji) {
  const matchedIndex = emojiSequence.findIndex((img) => img === matchedEmoji);
  return emojiSequence[(matchedIndex + 1) % emojiSequence.length];
}

function removeMatchedClass(event) {
  event.target.classList.remove("matched");
}

function handleDragEnd(event) {
  draggedElement.classList.remove("dragging");
  draggedElement = null;
  originalContent = "";
  originalCell = null;
}

function returnEmojiToOriginalCell() {
  originalCell.querySelector("img").style.visibility = "visible";
}

function handleTouchStart(event) {
  const touch = event.touches[0];

  draggedElement = document
    .elementFromPoint(touch.clientX, touch.clientY)
    ?.closest(".cell");
  if (draggedElement) {
    const imgElement = draggedElement.querySelector("img");

    if (imgElement) {
      originalContent = imgElement.src;
      originalCell = draggedElement;
      imgElement.style.visibility = "hidden";

      placeholder = createPlaceholder(originalContent);
      document.body.appendChild(placeholder);
      movePlaceholder(touch.clientX, touch.clientY);
    } else {
      console.error("Inget <img> element hittades i den valda cellen.");
    }
  } else {
  }
}

function handleTouchMove(event) {
  const touch = event.touches[0];
  movePlaceholder(touch.clientX, touch.clientY);
  touchElement = document
    .elementFromPoint(touch.clientX, touch.clientY)
    .closest(".cell");
}

function handleTouchMoveWithPreventDefault(event) {
  event.preventDefault();
  const touch = event.touches[0];
  movePlaceholder(touch.clientX, touch.clientY);
  touchElement = document
    .elementFromPoint(touch.clientX, touch.clientY)
    .closest(".cell");
}

function handleTouchEnd(event) {
  removeAllMatchedClasses();

  if (touchElement && touchElement !== originalCell) {
    const draggedEmojiFile = originalContent.split("/").pop();
    const targetEmojiFile = touchElement
      .querySelector("img")
      .src.split("/")
      .pop();

    if (draggedEmojiFile === targetEmojiFile) {
      incrementScore(originalContent);
      updateMovesAndProgress();

      // Kontrollera om spelet är i Version 1, Version 2, eller Version 3.1/3.2
      if (gameMode === "Version1" || gameMode === "Version2") {
        // Fyll båda cellerna i Version 1 och Version 2
        const [nextDraggedEmoji, nextTargetEmoji] =
          getNextTwoEmojis(draggedEmojiFile);
        updateEmojiImages(nextDraggedEmoji, nextTargetEmoji);
      } else {
        // I Version 3.1 och Version 3.2, hantera specifikt enligt reglerna
        originalCell.querySelector("img").src = "";
        touchElement.querySelector("img").src =
          getNextEmojiInSequence(draggedEmojiFile);

        // Speciell hantering för "imagePaths.drink" i Version 3.1 och 3.2
        if (draggedEmojiFile === imagePaths.drink.split("/").pop()) {
          fillEmptyCells(fillCountOnLastImageMatch);
        }
      }

      // Lägg till `matched`-klassen till de matchade elementen
      draggedElement.classList.add("matched");
      touchElement.classList.add("matched");

      // Lägg till lyssnare för att ta bort `matched`-klassen när animationen/övergången är klar
      draggedElement.addEventListener("animationend", removeMatchedClass);
      draggedElement.addEventListener("transitionend", removeMatchedClass);
      touchElement.addEventListener("animationend", removeMatchedClass);
      touchElement.addEventListener("transitionend", removeMatchedClass);

      checkGameOver();
    } else {
      returnEmojiToOriginalCell();
    }
  }

  cleanupTouchElements();
}

function updateMovesAndProgress() {
  moves--;
  document.getElementById("moves").textContent = moves;
  //updateProgressBarBasedOnMoves();
}

function updateEmojiImages(nextDraggedEmoji, nextTargetEmoji) {
  originalCell.querySelector("img").src = nextDraggedEmoji;
  touchElement.querySelector("img").src = nextTargetEmoji;
}

function addAndRemoveMatchedClasses() {
  draggedElement.classList.add("matched");
  touchElement.classList.add("matched");

  setTimeout(() => {
    removeAllMatchedClasses();
  }, 500);
}

function cleanupTouchElements() {
  if (placeholder) placeholder.remove();
  if (draggedElement)
    draggedElement.querySelector("img").style.visibility = "visible";
  draggedElement = null;
  touchElement = null;
  placeholder = null;
}

function removeAllMatchedClasses() {
  const matchedElements = document.querySelectorAll(".matched");
  matchedElements.forEach((element) => {
    element.classList.remove("matched");
  });
}

// Create a visual placeholder for the dragged element
function createPlaceholder(src) {
  const placeholder = document.createElement("img");
  placeholder.src = src;
  placeholder.style.position = "absolute";
  placeholder.style.width = "50px";
  placeholder.style.height = "50px";
  placeholder.style.pointerEvents = "none";
  return placeholder;
}
// // Update the progress bar based on remaining moves
// function updateProgressBarBasedOnMoves() {
//   const progressPercentage =
//     ((MaxMovesAndGoalScore - moves) / MaxMovesAndGoalScore) * 100;
//   document.getElementById(
//     "progress-bar"
//   ).style.width = `${progressPercentage}%`;
// }

function movePlaceholder(x, y) {
  if (!placeholder) return;

  const placeholderWidth = placeholder.offsetWidth;
  const placeholderHeight = placeholder.offsetHeight;

  window.requestAnimationFrame(() => {
    if (placeholder) {
      placeholder.style.left = `${x - placeholderWidth / 2}px`;
      placeholder.style.top = `${y - placeholderHeight / 2}px`;
    } else {
      console.warn(
        "Placeholder element is missing when trying to set position."
      );
    }
  });
}

function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

document.body.addEventListener("touchmove", throttle(handleTouchMove, 100));

// Get the next two emojis based on the matched emoji
function getNextTwoEmojis(matchedEmoji) {
  const fileName = matchedEmoji.split("/").pop();
  const matchedIndex = emojiSequence.findIndex((image) =>
    image.includes(fileName)
  );
  if (matchedIndex === -1) return [getRandomEmoji(), getRandomEmoji()];

  let nextEmoji1 = getRandomEmoji();
  let nextEmoji2 = emojiSequence[(matchedIndex + 1) % emojiSequence.length];
  while (nextEmoji1 === nextEmoji2) nextEmoji1 = getRandomEmoji();

  if (fileName === "melon.png") nextEmoji2 = imagePaths.drink;
  return [nextEmoji1, nextEmoji2];
}

function getRandomEmoji() {
  return emojiSequence[Math.floor(Math.random() * emojiSequence.length)];
}

function incrementScore(matchedEmoji) {
  const emojiFileName = matchedEmoji.split("/").pop();
  if (!Object.keys(scoreValues).some((path) => path.includes(emojiFileName)))
    return;
  score +=
    scoreValues[
      Object.keys(scoreValues).find((path) => path.includes(emojiFileName))
    ];
  document.getElementById("score").textContent = score;

  // document.getElementById("progress-bar").style.width = `${
  //   (score / MaxMovesAndGoalScore) * 100
  // }%`;

  checkGameOver();
}

function resetGameVersion2() {
  score = 0;
  moves = Infinity;
  document.getElementById("score").textContent = score;
  document.getElementById("progress-bar").style.width = "0%";

  const movesSection = document.getElementById("movesSection");
  const goalsSection = document.getElementById("goalsSection");

  if (movesSection) movesSection.style.display = "none";
  if (goalsSection) goalsSection.style.display = "block";

  createBoard();
}

// Function call to start Version2 game manually
//initVersion2();
// JavaScript för att toggla dropdown-menyn
document
  .querySelector(".dropdown-button")
  .addEventListener("click", function () {
    document.querySelector(".dropdown-content").classList.toggle("show");
  });

// Stänger dropdown-menyn om man klickar utanför den
window.onclick = function (event) {
  if (
    !event.target.matches(".dropdown-button") &&
    !event.target.matches(".arrow")
  ) {
    const dropdowns = document.getElementsByClassName("dropdown-content");
    for (let i = 0; i < dropdowns.length; i++) {
      const openDropdown = dropdowns[i];
      if (openDropdown.classList.contains("show")) {
        openDropdown.classList.remove("show");
      }
    }
  }
};

function resetGame() {
  location.reload();
}

createBoard();
document.body.addEventListener("touchmove", handleTouchMoveWithPreventDefault, {
  passive: false,
});
document.getElementById("modalButton").addEventListener("click", hideModal);
document.querySelector(".modal .close").addEventListener("click", hideModal);
window.addEventListener("click", (event) => {
  if (event.target === document.getElementById("gameModal")) hideModal();
});
