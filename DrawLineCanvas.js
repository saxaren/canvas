import React, { useRef, useState, useEffect, forwardRef } from "react";
import { StyleSheet, View, PanResponder, Switch, Button } from "react-native";
import Canvas from "react-native-canvas";

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

  const logCanvasContent = async () => {
    const canvas = canvasRef.current;
    if (canvas) {
      try {
        const dataURL = await canvas.toDataURL("image/png");
        if (dataURL) {
          console.log(dataURL);
          const json = JSON.stringify({ image: dataURL });
          console.log(json);
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
      <Button title="Logga canvas" onPress={logCanvasContent} />
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
