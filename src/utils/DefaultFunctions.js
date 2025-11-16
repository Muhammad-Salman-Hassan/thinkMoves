import { createToaster } from "@chakra-ui/react";


export function separateImages(croppedImages = [], metadata = {}, remaining_pgn = []) {
  if (!Array.isArray(croppedImages)) return { metadataImages: [], moveImages: [] };

  const metadataKeys = metadata ? Object.keys(metadata) : [];
  const metadataImages = [];
  const moveImages = [];

  croppedImages.forEach((url) => {
    if (typeof url !== "string") return;
    const matchedKey = metadataKeys.find((key) => url.includes(key));

    if (matchedKey) {
      metadataImages.push({ key: matchedKey, url });
    } else if (url.match(/(WhiteMove|BlackMove)_/)) {
      const match = url.match(/(\d+)(WhiteMove|BlackMove)/);
      if (match) {
        const [_, moveNumber, moveColor] = match;
        moveImages.push({
          moveNumber: parseInt(moveNumber),
          moveColor,
          url,
        });
      }
    }
  });

  moveImages.sort((a, b) => a.moveNumber - b.moveNumber);

 
  if (Array.isArray(remaining_pgn)) {
    remaining_pgn.forEach((line) => {
      const match = line.match(/^(\d+)\.\s*([^\s]+)\s*([^\s]+)?/);
      if (!match) return;

      const moveNumber = parseInt(match[1]);
      const whiteMove = match[2];
      const blackMove = match[3];

      const whiteIndex = moveImages.findIndex(
        (m) => m.moveNumber === moveNumber && m.moveColor === "WhiteMove"
      );
      if (whiteIndex !== -1) moveImages[whiteIndex].move = whiteMove;

      const blackIndex = moveImages.findIndex(
        (m) => m.moveNumber === moveNumber && m.moveColor === "BlackMove"
      );
      if (blackIndex !== -1) moveImages[blackIndex].move = blackMove;
    });
  }

  return { metadataImages, moveImages };
}


export function getMoveStyle(formData, move) {
  if (!formData.error || !move.moveColor) {
      return {
          borderColor: "green",
          bgColor: "white",
      };
  }


  const errorMatch = formData.error.match(/(White|Black) move (\d+) failed/i);
  
  if (!errorMatch) {
      return {
          borderColor: "green",
          bgColor: "white",
      };
  }

  const [, errorColor, errorMoveNumber] = errorMatch;
  const errorMoveNumberInt = parseInt(errorMoveNumber);
  

  const isError = 
      errorMoveNumberInt === move.moveNumber &&
      errorColor.toLowerCase() === move.moveColor.replace("Move", "").toLowerCase();

  return {
      borderColor: isError ? "red" : "green",
      bgColor: isError ? "orange" : "white",
  };
}


  

  export const toaster = createToaster({ placement: "bottom-end", pauseOnPageIdle: true, })