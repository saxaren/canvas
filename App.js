import React, { useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import DrawLineCanvas from "./DrawLineCanvas";

export default function App() {
  const canvasRef = useRef(null);

  const clearCanvas = (ctx) => {
    if (ctx) {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.title}>Rita en linje</Text>
      <DrawLineCanvas ref={canvasRef} clearCanvas={clearCanvas} />
      <View style={styles.buttonContainer}>
        <Button
          title="Rensa canvas"
          onPress={() => {
            if (canvasRef.current) {
              clearCanvas(canvasRef.current.getContext("2d"));
            }
          }}
        />
      </View>
      {/* <View style={styles.imageContainer}>
        <Image
          source={require("./assets/pic/jess-bailey-l3N9Q27zULw-unsplash.jpg")}
          style={{ width: 100, height: 100 }}
        />
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: 50,
  },
  title: {
    fontSize: 24,
    marginVertical: 20,
  },
  canvas: {
    marginVertical: 20,
  },
  buttonContainer: {
    marginTop: 20,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingBottom: 20,
  },
  // imageContainer: {
  //   marginVertical: 20,
  //   // flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   width: "100%",
  // },
});

// tips from Peter, proteceted area på canvasen
