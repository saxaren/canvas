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

const DrawLineCanvas = forwardRef(({ clearCanvas, fetchUrl }, ref) => {
  const canvasRef = useRef(null);
  const [ctx, setCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState(null);
  const [isFullSize, setIsFullSize] = useState(false);
  const [imageUri, setImageUri] = useState(
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA4QAAAOECAYAAAD5Tv87AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAADhKADAAQAAAABAAADhAAAAACiFCq0AAA7VElEQVR4Ae3XsQ3DMBRDQTuTe/MEWYGV/HDqCYj3K16XR4AAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQLnCtznfs3P3i3wfd79f78nQIAAAQIECJwmcD+n/ch/3i/weX8FDQgQIECAAAECBAgQIEBgETAIFzUZAgQIECBAgAABAgQIBAQMwsARVSBAgAABAgQIECBAgMAiYBAuajIECBAgQIAAAQIECBAICBiEgSOqQIAAAQIECBAgQIAAgUXAIFzUZAgQIECAAAECBAgQIBAQMAgDR1SBAAECBAgQIECAAAECi4BBuKjJECBAgAABAgQIECBAICBgEAaOqAIBAgQIECBAgAABAgQWAYNwUZMhQIAAAQIECBAgQIBAQMAgDBxRBQIECBAgQIAAAQIECCwCBuGiJkOAAAECBAgQIECAAIGAgEEYOKIKBAgQIECAAAECBAgQWAQMwkVNhgABAgQIECBAgAABAgEBgzBwRBUIECBAgAABAgQIECCwCBiEi5oMAQIECBAgQIAAAQIEAgIGYeCIKhAgQIAAAQIECBAgQGARMAgXNRkCBAgQIECAAAECBAgEBAzCwBFVIECAAAECBAgQIECAwCJgEC5qMgQIECBAgAABAgQIEAgIGISBI6pAgAABAgQIECBAgACBRcAgXNRkCBAgQIAAAQIECBAgEBAwCANHVIEAAQIECBAgQIAAAQKLgEG4qMkQIECAAAECBAgQIEAgIGAQBo6oAgECBAgQIECAAAECBBYBg3BRkyFAgAABAgQIECBAgEBAwCAMHFEFAgQIECBAgAABAgQILAIG4aImQ4AAAQIECBAgQIAAgYCAQRg4ogoECBAgQIAAAQIECBBYBAzCRU2GAAECBAgQIECAAAECAQGDMHBEFQgQIECAAAECBAgQILAIGISLmgwBAgQIECBAgAABAgQCAgZh4IgqECBAgAABAgQIECBAYBEwCBc1GQIECBAgQIAAAQIECAQEDMLAEVUgQIAAAQIECBAgQIDAImAQLmoyBAgQIECAAAECBAgQCAgYhIEjqkCAAAECBAgQIECAAIFFwCBc1GQIECBAgAABAgQIECAQEDAIA0dUgQABAgQIECBAgAABAouAQbioyRAgQIAAAQIECBAgQCAgYBAGjqgCAQIECBAgQIAAAQIEFgGDcFGTIUCAAAECBAgQIECAQEDAIAwcUQUCBAgQIECAAAECBAgsAgbhoiZDgAABAgQIECBAgACBgIBBGDiiCgQIECBAgAABAgQIEFgEDMJFTYYAAQIECBAgQIAAAQIBAYMwcEQVCBAgQIAAAQIECBAgsAgYhIuaDAECBAgQIECAAAECBAICBmHgiCoQIECAAAECBAgQIEBgETAIFzUZAgQIECBAgAABAgQIBAQMwsARVSBAgAABAgQIECBAgMAiYBAuajIECBAgQIAAAQIECBAICBiEgSOqQIAAAQIECBAgQIAAgUXAIFzUZAgQIECAAAECBAgQIBAQMAgDR1SBAAECBAgQIECAAAECi4BBuKjJECBAgAABAgQIECBAICBgEAaOqAIBAgQIECBAgAABAgQWAYNwUZMhQIAAAQIECBAgQIBAQMAgDBxRBQIECBAgQIAAAQIECCwCBuGiJkOAAAECBAgQIECAAIGAgEEYOKIKBAgQIECAAAECBAgQWAQMwkVNhgABAgQIECBAgAABAgEBgzBwRBUIECBAgAABAgQIECCwCBiEi5oMAQIECBAgQIAAAQIEAgIGYeCIKhAgQIAAAQIECBAgQGARMAgXNRkCBAgQIECAAAECBAgEBAzCwBFVIECAAAECBAgQIECAwCJgEC5qMgQIECBAgAABAgQIEAgIGISBI6pAgAABAgQIECBAgACBRcAgXNRkCBAgQIAAAQIECBAgEBAwCANHVIEAAQIECBAgQIAAAQKLgEG4qMkQIECAAAECBAgQIEAgIGAQBo6oAgECBAgQIECAAAECBBYBg3BRkyFAgAABAgQIECBAgEBAwCAMHFEFAgQIECBAgAABAgQILAIG4aImQ4AAAQIECBAgQIAAgYCAQRg4ogoECBAgQIAAAQIECBBYBAzCRU2GAAECBAgQIECAAAECAQGDMHBEFQgQIECAAAECBAgQILAIGISLmgwBAgQIECBAgAABAgQCAgZh4IgqECBAgAABAgQIECBAYBEwCBc1GQIECBAgQIAAAQIECAQEDMLAEVUgQIAAAQIECBAgQIDAImAQLmoyBAgQIECAAAECBAgQCAgYhIEjqkCAAAECBAgQIECAAIFFwCBc1GQIECBAgAABAgQIECAQEDAIA0dUgQABAgQIECBAgAABAouAQbioyRAgQIAAAQIECBAgQCAgYBAGjqgCAQIECBAgQIAAAQIEFgGDcFGTIUCAAAECBAgQIECAQEDAIAwcUQUCBAgQIECAAAECBAgsAgbhoiZDgAABAgQIECBAgACBgIBBGDiiCgQIECBAgAABAgQIEFgEDMJFTYYAAQIECBAgQIAAAQIBAYMwcEQVCBAgQIAAAQIECBAgsAgYhIuaDAECBAgQIECAAAECBAICBmHgiCoQIECAAAECBAgQIEBgETAIFzUZAgQIECBAgAABAgQIBAQMwsARVSBAgAABAgQIECBAgMAiYBAuajIECBAgQIAAAQIECBAICBiEgSOqQIAAAQIECBAgQIAAgUXAIFzUZAgQIECAAAECBAgQIBAQMAgDR1SBAAECBAgQIECAAAECi4BBuKjJECBAgAABAgQIECBAICBgEAaOqAIBAgQIECBAgAABAgQWAYNwUZMhQIAAAQIECBAgQIBAQMAgDBxRBQIECBAgQIAAAQIECCwCBuGiJkOAAAECBAgQIECAAIGAgEEYOKIKBAgQIECAAAECBAgQWAQMwkVNhgABAgQIECBAgAABAgEBgzBwRBUIECBAgAABAgQIECCwCBiEi5oMAQIECBAgQIAAAQIEAgIGYeCIKhAgQIAAAQIECBAgQGARMAgXNRkCBAgQIECAAAECBAgEBAzCwBFVIECAAAECBAgQIECAwCJgEC5qMgQIECBAgAABAgQIEAgIGISBI6pAgAABAgQIECBAgACBRcAgXNRkCBAgQIAAAQIECBAgEBAwCANHVIEAAQIECBAgQIAAAQKLgEG4qMkQIECAAAECBAgQIEAgIGAQBo6oAgECBAgQIECAAAECBBYBg3BRkyFAgAABAgQIECBAgEBAwCAMHFEFAgQIECBAgAABAgQILAIG4aImQ4AAAQIECBAgQIAAgYCAQRg4ogoECBAgQIAAAQIECBBYBAzCRU2GAAECBAgQIECAAAECAQGDMHBEFQgQIECAAAECBAgQILAIGISLmgwBAgQIECBAgAABAgQCAgZh4IgqECBAgAABAgQIECBAYBEwCBc1GQIECBAgQIAAAQIECAQEDMLAEVUgQIAAAQIECBAgQIDAImAQLmoyBAgQIECAAAECBAgQCAgYhIEjqkCAAAECBAgQIECAAIFFwCBc1GQIECBAgAABAgQIECAQEDAIA0dUgQABAgQIECBAgAABAouAQbioyRAgQIAAAQIECBAgQCAgYBAGjqgCAQIECBAgQIAAAQIEFgGDcFGTIUCAAAECBAgQIECAQEDAIAwcUQUCBAgQIECAAAECBAgsAgbhoiZDgAABAgQIECBAgACBgIBBGDiiCgQIECBAgAABAgQIEFgEDMJFTYYAAQIECBAgQIAAAQIBAYMwcEQVCBAgQIAAAQIECBAgsAgYhIuaDAECBAgQIECAAAECBAICBmHgiCoQIECAAAECBAgQIEBgETAIFzUZAgQIECBAgAABAgQIBAQMwsARVSBAgAABAgQIECBAgMAiYBAuajIECBAgQIAAAQIECBAICBiEgSOqQIAAAQIECBAgQIAAgUXAIFzUZAgQIECAAAECBAgQIBAQMAgDR1SBAAECBAgQIECAAAECi4BBuKjJECBAgAABAgQIECBAICBgEAaOqAIBAgQIECBAgAABAgQWAYNwUZMhQIAAAQIECBAgQIBAQMAgDBxRBQIECBAgQIAAAQIECCwCBuGiJkOAAAECBAgQIECAAIGAgEEYOKIKBAgQIECAAAECBAgQWAQMwkVNhgABAgQIECBAgAABAgEBgzBwRBUIECBAgAABAgQIECCwCBiEi5oMAQIECBAgQIAAAQIEAgIGYeCIKhAgQIAAAQIECBAgQGARMAgXNRkCBAgQIECAAAECBAgEBAzCwBFVIECAAAECBAgQIECAwCJgEC5qMgQIECBAgAABAgQIEAgIGISBI6pAgAABAgQIECBAgACBRcAgXNRkCBAgQIAAAQIECBAgEBAwCANHVIEAAQIECBAgQIAAAQKLgEG4qMkQIECAAAECBAgQIEAgIGAQBo6oAgECBAgQIECAAAECBBYBg3BRkyFAgAABAgQIECBAgEBAwCAMHFEFAgQIECBAgAABAgQILAIG4aImQ4AAAQIECBAgQIAAgYCAQRg4ogoECBAgQIAAAQIECBBYBAzCRU2GAAECBAgQIECAAAECAQGDMHBEFQgQIECAAAECBAgQILAIGISLmgwBAgQIECBAgAABAgQCAgZh4IgqECBAgAABAgQIECBAYBEwCBc1GQIECBAgQIAAAQIECAQEDMLAEVUgQIAAAQIECBAgQIDAImAQLmoyBAgQIECAAAECBAgQCAgYhIEjqkCAAAECBAgQIECAAIFFwCBc1GQIECBAgAABAgQIECAQEDAIA0dUgQABAgQIECBAgAABAouAQbioyRAgQIAAAQIECBAgQCAgYBAGjqgCAQIECBAgQIAAAQIEFgGDcFGTIUCAAAECBAgQIECAQEDAIAwcUQUCBAgQIECAAAECBAgsAgbhoiZDgAABAgQIECBAgACBgIBBGDiiCgQIECBAgAABAgQIEFgEDMJFTYYAAQIECBAgQIAAAQIBAYMwcEQVCBAgQIAAAQIECBAgsAgYhIuaDAECBAgQIECAAAECBAICBmHgiCoQIECAAAECBAgQIEBgETAIFzUZAgQIECBAgAABAgQIBAQMwsARVSBAgAABAgQIECBAgMAiYBAuajIECBAgQIAAAQIECBAICBiEgSOqQIAAAQIECBAgQIAAgUXAIFzUZAgQIECAAAECBAgQIBAQMAgDR1SBAAECBAgQIECAAAECi4BBuKjJECBAgAABAgQIECBAICBgEAaOqAIBAgQIECBAgAABAgQWAYNwUZMhQIAAAQIECBAgQIBAQMAgDBxRBQIECBAgQIAAAQIECCwCBuGiJkOAAAECBAgQIECAAIGAgEEYOKIKBAgQIECAAAECBAgQWAQMwkVNhgABAgQIECBAgAABAgEBgzBwRBUIECBAgAABAgQIECCwCBiEi5oMAQIECBAgQIAAAQIEAgIGYeCIKhAgQIAAAQIECBAgQGARMAgXNRkCBAgQIECAAAECBAgEBAzCwBFVIECAAAECBAgQIECAwCJgEC5qMgQIECBAgAABAgQIEAgIGISBI6pAgAABAgQIECBAgACBRcAgXNRkCBAgQIAAAQIECBAgEBAwCANHVIEAAQIECBAgQIAAAQKLgEG4qMkQIECAAAECBAgQIEAgIGAQBo6oAgECBAgQIECAAAECBBYBg3BRkyFAgAABAgQIECBAgEBAwCAMHFEFAgQIECBAgAABAgQILAIG4aImQ4AAAQIECBAgQIAAgYCAQRg4ogoECBAgQIAAAQIECBBYBAzCRU2GAAECBAgQIECAAAECAQGDMHBEFQgQIECAAAECBAgQILAIGISLmgwBAgQIECBAgAABAgQCAgZh4IgqECBAgAABAgQIECBAYBEwCBc1GQIECBAgQIAAAQIECAQEDMLAEVUgQIAAAQIECBAgQIDAImAQLmoyBAgQIECAAAECBAgQCAgYhIEjqkCAAAECBAgQIECAAIFFwCBc1GQIECBAgAABAgQIECAQEDAIA0dUgQABAgQIECBAgAABAouAQbioyRAgQIAAAQIECBAgQCAgYBAGjqgCAQIECBAgQIAAAQIEFgGDcFGTIUCAAAECBAgQIECAQEDAIAwcUQUCBAgQIECAAAECBAgsAgbhoiZDgAABAgQIECBAgACBgIBBGDiiCgQIECBAgAABAgQIEFgEDMJFTYYAAQIECBAgQIAAAQIBAYMwcEQVCBAgQIAAAQIECBAgsAgYhIuaDAECBAgQIECAAAECBAICBmHgiCoQIECAAAECBAgQIEBgETAIFzUZAgQIECBAgAABAgQIBAQMwsARVSBAgAABAgQIECBAgMAiYBAuajIECBAgQIAAAQIECBAICBiEgSOqQIAAAQIECBAgQIAAgUXAIFzUZAgQIECAAAECBAgQIBAQMAgDR1SBAAECBAgQIECAAAECi4BBuKjJECBAgAABAgQIECBAICBgEAaOqAIBAgQIECBAgAABAgQWAYNwUZMhQIAAAQIECBAgQIBAQMAgDBxRBQIECBAgQIAAAQIECCwCBuGiJkOAAAECBAgQIECAAIGAgEEYOKIKBAgQIECAAAECBAgQWAQMwkVNhgABAgQIECBAgAABAgEBgzBwRBUIECBAgAABAgQIECCwCBiEi5oMAQIECBAgQIAAAQIEAgIGYeCIKhAgQIAAAQIECBAgQGARMAgXNRkCBAgQIECAAAECBAgEBAzCwBFVIECAAAECBAgQIECAwCJgEC5qMgQIECBAgAABAgQIEAgIGISBI6pAgAABAgQIECBAgACBRcAgXNRkCBAgQIAAAQIECBAgEBAwCANHVIEAAQIECBAgQIAAAQKLgEG4qMkQIECAAAECBAgQIEAgIGAQBo6oAgECBAgQIECAAAECBBYBg3BRkyFAgAABAgQIECBAgEBAwCAMHFEFAgQIECBAgAABAgQILAIG4aImQ4AAAQIECBAgQIAAgYCAQRg4ogoECBAgQIAAAQIECBBYBAzCRU2GAAECBAgQIECAAAECAQGDMHBEFQgQIECAAAECBAgQILAIGISLmgwBAgQIECBAgAABAgQCAgZh4IgqECBAgAABAgQIECBAYBEwCBc1GQIECBAgQIAAAQIECAQEDMLAEVUgQIAAAQIECBAgQIDAImAQLmoyBAgQIECAAAECBAgQCAgYhIEjqkCAAAECBAgQIECAAIFFwCBc1GQIECBAgAABAgQIECAQEDAIA0dUgQABAgQIECBAgAABAouAQbioyRAgQIAAAQIECBAgQCAgYBAGjqgCAQIECBAgQIAAAQIEFgGDcFGTIUCAAAECBAgQIECAQEDAIAwcUQUCBAgQIECAAAECBAgsAgbhoiZDgAABAgQIECBAgACBgIBBGDiiCgQIECBAgAABAgQIEFgEDMJFTYYAAQIECBAgQIAAAQIBAYMwcEQVCBAgQIAAAQIECBAgsAgYhIuaDAECBAgQIECAAAECBAICBmHgiCoQIECAAAECBAgQIEBgETAIFzUZAgQIECBAgAABAgQIBAQMwsARVSBAgAABAgQIECBAgMAiYBAuajIECBAgQIAAAQIECBAICBiEgSOqQIAAAQIECBAgQIAAgUXAIFzUZAgQIECAAAECBAgQIBAQMAgDR1SBAAECBAgQIECAAAECi4BBuKjJECBAgAABAgQIECBAICBgEAaOqAIBAgQIECBAgAABAgQWAYNwUZMhQIAAAQIECBAgQIBAQMAgDBxRBQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBAgQIAAAQIECBD4C/wAJIkEWDxhLDcAAAAASUVORK5CYII="
  );
  const [shapes, setShapes] = useState([]);

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
        const dataURL = (await canvas.toDataURL("image/png")).replace(/"/g, "");
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
      const dataURL = await AsyncStorage.getItem("canvas_image");
      if (dataURL) {
        console.log("Retrieved dataURL:", dataURL);
        setImageUri(dataURL); // Sätt dataURL i state-variabeln
      } else {
        console.log("No image found in AsyncStorage");
      }
    } catch (error) {
      console.error("Error while loading canvas image:", error);
    }
  };

  const fetchShapes = async () => {
    try {
      const response = await fetch(
        "https://raw.githubusercontent.com/saxaren/canvas/main/shapes.json"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log("Fetched data:", result);
      setShapes(result); // Anropa getShapes med den hämtade datan
    } catch (error) {
      console.error("Det gick inte att hämta former:", error);
    }
  };

  const drawShape = (shape) => {
    const { type, color } = shape;
    const ctx = canvas.getContext("2d"); // Se till att du har en referens till din canvas-kontext

    ctx.fillStyle = color;
    ctx.strokeStyle = color;

    switch (type) {
      case "rectangle":
        ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
        break;
      case "triangle":
        ctx.beginPath();

        ctx.moveTo(shape.points[0].x, shape.points[0].y);
        ctx.lineTo(shape.points[1].x, shape.points[1].y);
        ctx.lineTo(shape.points[2].x, shape.points[2].y);
        ctx.closePath();
        ctx.fill();
        break;
      case "circle":
        ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
        ctx.fill();
        break;
      default:
        console.log("Unknown shape:", type);
        break;
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
        <Button title="drawRectangles" onPress={drawShape} />
      </View>

      <View style={styles.imageContainer}>
        {/* <Image
          source={require("./assets/pic/jess-bailey-l3N9Q27zULw-unsplash.jpg")}
          style={{ width: 100, height: 100 }}
        /> */}
        {imageUri && (
          <Image
            source={{
              uri: imageUri,
            }}
            style={{ width: 100, height: 100 }}
          />
        )}
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

// -----------------------------------------------------------

// const drawShape = (shape) => {
//   const { type, color } = shape;
//   const ctx = canvas.getContext("2d"); // Se till att du har en referens till din canvas-kontext

//   ctx.fillStyle = color;
//   ctx.strokeStyle = color;

//   switch (type) {
//     case "rectangle":
//       ctx.fillRect(shape.x, shape.y, shape.width, shape.height);
//       break;
//     case "triangle":
//       ctx.beginPath();

//       ctx.moveTo(shape.points[0].x, shape.points[0].y);
//       ctx.lineTo(shape.points[1].x, shape.points[1].y);
//       ctx.lineTo(shape.points[2].x, shape.points[2].y);
//       ctx.closePath();
//       ctx.fill();
//       break;
//     case "circle":
//       ctx.beginPath();
//       ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
//       ctx.fill();
//       break;
//     default:
//       console.log("Unknown shape:", type);
//       break;
//   }
// };
