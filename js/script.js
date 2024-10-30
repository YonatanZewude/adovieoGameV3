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
let fillCountOnLastImageMatch = 2;

let board = document.getElementById("board");
let score = 0;
let moves = MaxMovesAndGoalScore;
let draggedElement = null;
let originalContent = "";
let originalCell = null;
let touchElement = null;
let placeholder = null;
let gameMode = "Version1";
let activeTouchId = null;

const goalDisplay = document.getElementById("goals");
const scoreDisplay = document.getElementById("score");
const movesDisplay = document.getElementById("moves");
const goalsSection = document.getElementById("goalsSection");
const movesSection = document.getElementById("movesSection");
const isMobile =
  "ontouchstart" in window ||
  /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);

window.onload = function () {
  document.querySelectorAll("img").forEach((img) => {
    img.addEventListener(
      "touchstart",
      function (e) {
        e.preventDefault();
      },
      { passive: false }
    );
  });
};

function fillEmptyCells() {
  const emptyCells = [...document.querySelectorAll(".cell img[src='']")];

  if (emptyCells.length > fillCountOnLastImageMatch) {
    const shuffledEmptyCells = emptyCells.sort(() => 0.5 - Math.random());
    for (let i = 0; i < fillCountOnLastImageMatch; i++) {
      shuffledEmptyCells[i].src = getRandomEmoji();
    }
  } else {
    emptyCells.forEach((cell) => {
      cell.src = getRandomEmoji();
    });
  }
}

function switchGameMode() {
  if (gameMode === "Version1") {
    initVersion2();
    gameMode = "Version2";
  } else if (gameMode === "Version2") {
    initVersion3();
    gameMode = "Version3";
  } else {
    resetGameVersion1();
    gameMode = "Version1";
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

function resetGameVersion1() {
  gameMode = "Version1";
  score = 0;
  moves = MaxMovesAndGoalScore;
  scoreDisplay.textContent = score;
  movesDisplay.textContent = moves;

  movesSection.classList.remove("hidden");
  goalsSection.classList.add("hidden");

  createBoard();
}

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < totalCells; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.setAttribute("draggable", true);
    const imgElement = document.createElement("img");
    imgElement.src = getRandomEmoji();
    cell.appendChild(imgElement);
    board.addEventListener("dragstart", handleDragStart);
    board.addEventListener("dragover", handleDragOver);
    board.addEventListener("drop", handleDrop);
    board.addEventListener("dragend", handleDragEnd);
    board.addEventListener("touchstart", handleTouchStart, { passive: false });
    board.addEventListener("touchmove", handleTouchMove, { passive: false });
    board.addEventListener("touchend", handleTouchEnd, { passive: false });

    board.appendChild(cell);
  }
}

document.addEventListener("selectstart", function (e) {
  e.preventDefault();
});

function initVersion2() {
  gameMode = "Version2";
  score = 0;
  moves = Infinity;
  scoreDisplay.textContent = score;

  goalsSection.classList.remove("hidden");
  movesSection.classList.add("hidden");

  goalDisplay.textContent = MaxMovesAndGoalScore;

  createBoard();
}

function initVersion3() {
  gameMode = "Version3";
  score = 0;
  moves = Infinity;

  goalsSection.classList.add("hidden");
  movesSection.classList.add("hidden");
  scoreDisplay.textContent = score;

  createBoard();
}

function checkGameOver() {
  if (gameMode === "Version1") {
    if (moves <= 0)
      showModal(
        `Game Over! You scored ${score} points in ${MaxMovesAndGoalScore} moves. Try again!`
      );
  } else if (gameMode === "Version2") {
    if (score >= MaxMovesAndGoalScore)
      showModal(`Congratulations! You reached ${score} points! You Win!`);
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

  const targetCell = event.target.closest(".cell");

  if (!targetCell) {
    returnEmojiToOriginalCell();
    return;
  }

  const draggedEmoji = event.dataTransfer.getData("text/plain");
  const targetEmoji = targetCell.querySelector("img").src;

  const draggedEmojiFile = draggedEmoji.split("/").pop();
  const targetEmojiFile = targetEmoji.split("/").pop();

  if (draggedEmojiFile === targetEmojiFile && draggedElement !== targetCell) {
    incrementScore(draggedEmoji);

    if (gameMode === "Version3") {
      originalCell.querySelector("img").src = "";
      targetCell.querySelector("img").src = getNextEmoji(draggedEmoji);

      if (draggedEmojiFile === imagePaths.drink.split("/").pop()) {
        fillEmptyCells();
      }
    } else {
      const nextEmojis = getNextTwoEmojis(draggedEmoji);
      originalCell.querySelector("img").src = nextEmojis[0];
      targetCell.querySelector("img").src = nextEmojis[1];
    }

    checkGameOver();
  } else {
    returnEmojiToOriginalCell();
  }
}

function getNextEmoji(matchedEmoji) {
  const fileName = matchedEmoji.split("/").pop();
  const matchedIndex = emojiSequence.findIndex((image) =>
    image.includes(fileName)
  );
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
  if (event.touches.length > 1) return;

  const touch = event.touches[0];
  activeTouchId = touch.identifier;

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
      console.error("No <img> element found in the selected cell.");
    }
  }
}

function movePlaceholder(x, y) {
  if (placeholder) {
    placeholder.style.left = `${x - placeholder.offsetWidth / 2}px`;
    placeholder.style.top = `${y - placeholder.offsetHeight / 2}px`;
  }
}
function handleTouchMove(event) {
  event.preventDefault();

  const touch = Array.from(event.touches).find(
    (t) => t.identifier === activeTouchId
  );
  if (!touch) return;

  movePlaceholder(touch.clientX, touch.clientY);

  touchElement = document
    .elementFromPoint(touch.clientX, touch.clientY)
    ?.closest(".cell");
}
function handleTouchEnd(event) {
  const touch = Array.from(event.changedTouches).find(
    (t) => t.identifier === activeTouchId
  );
  if (!touch) return;

  if (touchElement && touchElement !== originalCell) {
    const draggedEmojiFile = originalContent.split("/").pop();
    const targetEmojiFile = touchElement
      .querySelector("img")
      .src.split("/")
      .pop();

    if (draggedEmojiFile === targetEmojiFile) {
      incrementScore(originalContent);

      if (gameMode === "Version3") {
        originalCell.querySelector("img").src = "";
        touchElement.querySelector("img").src = getNextEmoji(draggedEmojiFile);

        if (draggedEmojiFile === imagePaths.drink.split("/").pop()) {
          fillEmptyCells();
        }
      } else {
        const [nextDraggedEmoji, nextTargetEmoji] =
          getNextTwoEmojis(draggedEmojiFile);
        updateEmojiImages(nextDraggedEmoji, nextTargetEmoji);
      }

      checkGameOver();
    } else {
      returnEmojiToOriginalCell();
    }
  } else {
    returnEmojiToOriginalCell();
  }

  cleanupTouchElements();
  activeTouchId = null;
}

function updateMovesAndProgress() {
  moves--;
  document.getElementById("moves").textContent = moves;
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

function createPlaceholder(src) {
  const placeholder = document.createElement("img");
  placeholder.src = src;
  placeholder.style.position = "absolute";
  placeholder.style.width = "50px";
  placeholder.style.height = "50px";
  placeholder.style.pointerEvents = "none";
  return placeholder;
}

function movePlaceholder(x, y) {
  if (placeholder) {
    placeholder.style.left = `${x - placeholder.offsetWidth / 2}px`;
    placeholder.style.top = `${y - placeholder.offsetHeight / 2}px`;
  }
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

  checkGameOver();
}

function resetGameVersion2() {
  score = 0;
  moves = Infinity;
  document.getElementById("score").textContent = score;
  document.getElementById("progress-bar").style.width = "0%";

  if (movesSection) movesSection.style.display = "none";
  goalsSection.style.display = "block";

  createBoard();
}

function resetGame() {
  location.reload();
}

createBoard();

document.getElementById("modalButton").addEventListener("click", hideModal);
document.querySelector(".modal .close").addEventListener("click", hideModal);
window.addEventListener("click", (event) => {
  if (event.target === document.getElementById("gameModal")) hideModal();
});
// Adding event listeners for the buttons to start each version of the game
document.getElementById("Version1Button").addEventListener("click", () => {
  resetGameVersion1();
});

document.getElementById("Version2Button").addEventListener("click", () => {
  initVersion2();
});

document.getElementById("Version3Button").addEventListener("click", () => {
  initVersion3();
});
