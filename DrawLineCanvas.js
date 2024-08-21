import React, { useRef, useState, useEffect, forwardRef } from "react";
import {
  StyleSheet,
  View,
  PanResponder,
  Switch,
  Button,
  Text,
  FlatList,
  Image,
} from "react-native";
import Canvas from "react-native-canvas";
import AsyncStorage from "@react-native-async-storage/async-storage";

const DrawLineCanvas = forwardRef(({ clearCanvas }, ref) => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);
  const [isFullSize, setIsFullSize] = useState(false);
  // const [imageUri, setIamgeUri = useState(null)]
  // const [shapes, setShape ] = useState([])

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

  // useEffect(() => {
  //   fetchShapes();
  // }, []); //hämta figurer vid laddning

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

  const fetchShapes = async () => {
    fetch("https://raw.githubusercontent.com/saxaren/canvas/main/shapes.json")
      .then((response) => response.json())
      .then((result) => {
        getShapes(result);
      });
    console.log(getShapes(result));
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
        <Button title="fetch" onPress={fetchShapes} />
      </View>

      <View style={styles.imageContainer}>
        <Image
          source={require("./assets/pic/jess-bailey-l3N9Q27zULw-unsplash.jpg")}
          style={{ width: 100, height: 100 }}
        />
      </View>
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
  imageContainer: {
    marginVertical: 20,
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
});

export default DrawLineCanvas;

// const drawShape = (shape)
//   => {
//     const { type, color} = shape
//     ctx.fillStyle = color
//     ctx.strokeStyle = color
//   }

//   switch (type) {
// case "rectangle":
//   ctx.fillRect(shape.x, shape.y shape.width, shape.height)
//   break
// case "triangle":
//   ctx.beginPath()

// ctx.moveTo(shape.points[0].x, shape.points[0],y)
// ctx.lineTo(shape.points[1].x, shape.points[1],y)
// ctx.lineTo(shape.points[2].x, shape.points[2],y)
// ctx.closePath()
// ctx.fill()

// case "circle":
//   ctx.beginPath
// ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI)
// ctx.fill()
// break
// default:
//   console.log("Unknown shape:", type)
//   }
//   }

//  rektangel för att felsöka

// useEffect(() => {
//   if (ctx) {
//     ctx.fillStyle = "rgba(0, 0, 255, 0.5)";
//     ctx.fillRect(50, 50, 200, 100);
//   }
// }, [ctx]);
