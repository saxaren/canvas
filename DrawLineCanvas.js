import React, { useRef, useState, useEffect, forwardRef } from "react";
import {
  StyleSheet,
  View,
  PanResponder,
  Switch,
  Button,
  Text,
} from "react-native";
import Canvas from "react-native-canvas";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DrawLineCanvas = forwardRef(({ clearCanvas }, ref) => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);
  const [isFullSize, setIsFullSize] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        setCtx(context);
        const newSize = isFullSize ? 400 : 300;
        canvas.width = newSize;
        canvas.height = newSize;

        // Rensa canvasen vid storleksändring
        context.clearRect(0, 0, canvas.width, canvas.height);

        //lägg till bilden
        // const img = new Image()
        // img.src = ''
      }
    }
  }, [isFullSize]);

  useEffect(() => {
    if (ref) {
      ref.current = canvasRef.current;
    }
  }, [ref]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderStart: (e) => {
      const { locationX, locationY } = e.nativeEvent;
      setLastPoint({ x: locationX, y: locationY });
      setIsDrawing(true);
    },
    onPanResponderMove: (e) => {
      if (!isDrawing || !ctx) return;
      const { locationX, locationY } = e.nativeEvent;
      const newPoint = { x: locationX, y: locationY };

      if (lastPoint) {
        ctx.beginPath();
        ctx.moveTo(lastPoint.x, lastPoint.y);
        ctx.lineTo(newPoint.x, newPoint.y);
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      setLastPoint(newPoint);
    },
    onPanResponderEnd: () => {
      setIsDrawing(false);
      setLastPoint(null);
    },
  });

  const toggleSize = () => {
    setIsFullSize(!isFullSize);
  };

  const drawRectangle = () => {
    console.log("DrawRectangle called");
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (canvas && ctx) {
      ctx.fillStyle = "rgba(0, 0, 255, 0.5)"; // Blå färg med 50% genomskinlighet
      ctx.fillRect(50, 50, 200, 100); // Rita en rektangel med vä ö hörn (50, 50) strl 200x100
    } else {
      console.log("Rektangel ritad");

      console.log("Canvas or context is not available");
    }
  };

  // useEffect(() => {
  //   if (ctx) {
  //     ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
  //     ctx.fillRect(50, 50, 200, 100);
  //   }
  // }, [ctx]);

  const logCanvasContent = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        //konverterar
        const dataURL = await canvas.toDataURL("image/png");
        if (dataURL) {
          //loggar dataURL
          console.log("dataURL", dataURL);
          const json = JSON.stringify({ image: dataURL });
          console.log("json", json);

          await AsyncStorage.setItem("canvas_image", dataURL);
          console.log("Image saved to AsyncStorage");
        } else {
          console.log("Canvas dataURL is empty.");
        }
      } catch (error) {
        console.error("Error while logging canvas content:", error);
      }
    } else {
      console.log("Canvas reference is null.");
    }
  };

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

  //         // rensa canvas och rita bilden
  //         ctx.clearRect(0, 0, canvas.width, canvas.height); // Rensa canvas
  //         ctx.drawImage(img, 0, 0); // Rita bilden på canvas
  //         console.log("Image drawn to Canvas");
  //         console.log("Image drawn to canvas");
  //       } else {
  //         console.log("Canvas or context is not available");
  //       }
  //     } else {
  //       console.log("No image found in AsyncStorage");
  //     }
  //   } catch (error) {
  //     console.error("Error while loading canvas image", error);
  //   }
  // };

  return (
    <View style={styles.container}>
      <Switch
        value={isFullSize}
        onValueChange={toggleSize}
        style={styles.switch}
      />
      <View
        style={[
          styles.canvasContainer,
          isFullSize ? styles.fullSize : styles.defaultSize,
        ]}
        {...panResponder.panHandlers}
      >
        <Canvas ref={canvasRef} />
      </View>
      <View>
        <Button
          title="Rita Rektangel"
          onPress={() => {
            console.log("Button Pressed");
            drawRectangle();
          }}
        />
      </View>
      <View>
        <Button title="Logga canvas" onPress={logCanvasContent} />
      </View>
      <View>
        <Button title="Ladda Bild" onPress={loadCanvasImage} />
      </View>
      <View>
        <Button title="Ladda Bild 2" onPress={loadCanvasImage} />
      </View>
      <Text>hej</Text>
    </View>
  );
});

DrawLineCanvas.displayName = "DrawLineCanvas";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  canvasContainer: {
    borderColor: "black",
    borderWidth: 1,
  },
  defaultSize: {
    width: 300,
    height: 300,
  },
  fullSize: {
    width: 400,
    height: 400,
  },
  switch: {
    marginBottom: 10,
  },
});

export default DrawLineCanvas;
