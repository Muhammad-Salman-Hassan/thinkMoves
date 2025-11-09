import { createToaster } from "@chakra-ui/react";

export function separateImages(croppedImages = [], metadata = {}) {
    if (!Array.isArray(croppedImages)) return { metadataImages: [], moveImages: [] };
  
    const metadataKeys = metadata ? Object.keys(metadata) : [];
  
    const metadataImages = [];
    const moveImages = [];
  
    croppedImages.forEach((url) => {
      if (typeof url !== "string") return;
  
   
      const matchedKey = metadataKeys.find((key) => url.includes(key));
  
      if (matchedKey) {
        metadataImages.push({
          key: matchedKey,
          url,
        });
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
  
    return {
      metadataImages,
      moveImages,
    };
  }
  

  export const toaster = createToaster({ placement: "bottom-end", pauseOnPageIdle: true, })