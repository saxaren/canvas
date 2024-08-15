import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View, PanResponder } from "react-native";
import Canvas from "react-native-canvas";

const DrawLineCanvas = () => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const context = canvas.getContext("2d");
      if (context) {
        console.log("Canvas context obtained");
        setCtx(context);
        canvas.width = 300;
        canvas.height = 300;

        // Test drawing a rectangle to verify the canvas works
        context.fillStyle = "red";
        context.fillRect(10, 10, 50, 50);
      } else {
        console.log("Failed to obtain canvas context");
      }
    } else {
      console.log("Canvas is not available");
    }
  }, []);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderStart: (e) => {
      console.log("Touch start");
      const { locationX, locationY } = e.nativeEvent;
      setLastPoint({ x: locationX, y: locationY });
      setIsDrawing(true);
    },
    onPanResponderMove: (e) => {
      if (!isDrawing || !ctx) return;
      const { locationX, locationY } = e.nativeEvent;
      const newPoint = { x: locationX, y: locationY };

      if (lastPoint) {
        console.log(
          `Drawing from (${lastPoint.x}, ${lastPoint.y}) to (${newPoint.x}, ${newPoint.y})`
        );
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
      console.log("Touch end");
      setIsDrawing(false);
      setLastPoint(null);
    },
  });

  return (
    <View {...panResponder.panHandlers} style={styles.canvasContainer}>
      <Canvas ref={canvasRef} />
    </View>
  );
};

export default function App() {
  return (
    <View style={styles.container}>
      <DrawLineCanvas />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  canvasContainer: {
    width: 300,
    height: 300,
    borderColor: "black",
    borderWidth: 1,
  },
});
