const loadCanvasImage = async () => {
  try {
    // hämta dataURL från AsyncStorage
    const dataURL = await AsyncStorage.getItem("canvas_image");
    if (dataURL) {
      console.log("Retrieved dataURL:", dataURL); //logga dataURL

      //skapa referens till canvas och dess content
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (canvas && ctx) {
        // skapa nytt Image-objekt
        const img = new Image();
        // const img = new Canvas.Image();

        img.src = dataURL; // sätta bildälla direkt till dataURL

        // Hantera bildinladdning korrekt
        img.onload = () => {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0);
          console.log("Image drawn to Canvas");
        };

        img.onerror = (error) => {
          console.error("Error loading image:", error);
        };
      } else {
        console.log("Canvas or context is not available");
      }
    } else {
      console.log("No image found in AsyncStorage");
    }
  } catch (error) {
    console.error("Error while loading canvas image:", error);
  }
};
