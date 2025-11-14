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

  // attach PGN moves
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
  const isError =
    formData.errorColor &&
    formData.errorColor.toLowerCase() === move.moveColor.replace("Move", "").toLowerCase() &&
    formData.error?.includes(move.moveNumber);

  return {
    borderColor: isError ? "red" : "green",
    bgColor: isError ? "orange" : "white",
  };
}


  

  export const toaster = createToaster({ placement: "bottom-end", pauseOnPageIdle: true, })