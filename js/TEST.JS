function getNextEmojiInSequence(matchedEmoji) {
  const matchedIndex = emojiSequence.findIndex((img) => img === matchedEmoji);
  return emojiSequence[(matchedIndex + 1) % emojiSequence.length];
}

function fillEmptyCells(fillCount) {
    const emptyCells = Array.from(document.querySelectorAll(".cell img[src='']"));
    touchElement.querySelector("img").src = nextTargetEmoji;
  }
  
//  V 1 AND 2
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

function updateEmojiImages(nextDraggedEmoji, nextTargetEmoji) {
  originalCell.querySelector("img").src = nextDraggedEmoji;
  touchElement.querySelector("img").src = nextTargetEmoji;
}

