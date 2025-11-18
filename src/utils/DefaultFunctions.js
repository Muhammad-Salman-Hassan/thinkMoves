import { createToaster } from "@chakra-ui/react";


export function separateImages(croppedImages = [], metadata = {}, remaining_pgn = [], correct_pgn = []) {
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


  const allMovesMap = new Map();

  
  const parseAllMoves = (pgnArray) => {
    if (!Array.isArray(pgnArray)) return [];
    
    const moves = [];
    
    const allLines = pgnArray.join('\n').split('\n');
    
    allLines.forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed) return;
      
      if (/^\d+\.$/.test(trimmed)) return;
      
      const match = trimmed.match(/^(\d+)\.\s+(.+)$/);
      if (!match) return;
      
      const moveNumber = parseInt(match[1]);
      const movesText = match[2].trim();
      
      
      const moveParts = movesText.split(/\s+/).filter(part => {
   
        return part && !/^\d+\.$/.test(part);
      });
      
      
      if (moveParts[0]) {
        moves.push({
          moveNumber,
          moveColor: "WhiteMove",
          move: moveParts[0],
        });
      }
      
    
      if (moveParts[1]) {
        moves.push({
          moveNumber,
          moveColor: "BlackMove",
          move: moveParts[1],
        });
      }
    });
    
    return moves;
  };

  
  const correctMoves = parseAllMoves(correct_pgn);
  correctMoves.forEach((move) => {
    const key = `${move.moveNumber}-${move.moveColor}`;
    allMovesMap.set(key, {
      ...move,
      url: null,
    });
  });

 
  const remainingMoves = parseAllMoves(remaining_pgn);
  remainingMoves.forEach((move) => {
    const key = `${move.moveNumber}-${move.moveColor}`;
    if (!allMovesMap.has(key)) {
      allMovesMap.set(key, {
        ...move,
        url: null,
      });
    }
  });


  moveImages.forEach((img) => {
    const key = `${img.moveNumber}-${img.moveColor}`;
    const existingMove = allMovesMap.get(key);
    
    if (existingMove) {
      existingMove.url = img.url;
    } else {
      allMovesMap.set(key, img);
    }
  });

  
  const finalMoveImages = Array.from(allMovesMap.values())
    .sort((a, b) => {
      if (a.moveNumber !== b.moveNumber) {
        return a.moveNumber - b.moveNumber;
      }
      return a.moveColor === "WhiteMove" ? -1 : 1;
    });

  return { metadataImages, moveImages: finalMoveImages };
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