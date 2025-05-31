import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  View,
} from "react-native";
import Pdf from "react-native-pdf";
import { ThemedText } from "@/components/ThemedText"; // Assuming you have this

export default function PdfViewerScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  const [pdfSource, setPdfSource] = useState<{ uri: string; cache?: boolean } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (uri) {
      console.log("PDF URI received:", uri);
      setPdfSource({ uri: decodeURIComponent(uri), cache: true });
      setError(null);
    } else {
      console.error("No URI provided for PDF viewer");
      setError("No PDF URI was provided to display.");
    }
  }, [uri]);

  if (error) {
    return (
      <View style={styles.centered}>
        <ThemedText type="defaultSemiBold" style={{ color: "red" }}>
          Error: {error}
        </ThemedText>
      </View>
    );
  }

  // Show loading indicator until pdfSource is set and Pdf component starts loading
  // The Pdf component itself has onLoadComplete and onError, so this initial loading
  // is more about URI processing.
  if (!pdfSource) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <ThemedText style={{ marginTop: 10 }}>Preparing PDF...</ThemedText>
      </View>
    );
  }

  if (!pdfSource) {
    // This case should ideally be caught by the error state if URI is missing.
    // But as a fallback:
    return (
      <View style={styles.centered}>
        <ThemedText>No PDF source to display.</ThemedText>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pdf
        source={pdfSource}
        style={styles.pdf}
        trustAllCerts={false} // Important for Android SSL, adjust as needed
        onLoadComplete={(numberOfPages, filePath) => {
          console.log(`Number of pages: ${numberOfPages}, Path: ${filePath}`);
        }}
        onError={(pdfError) => {
          console.error("PDF load error:", pdfError);
          setError(`Failed to load PDF. ${String(pdfError)}`);
        }}
        onPageChanged={(page, numberOfPages) => {
          console.log(`Current page: ${page}/${numberOfPages}`);
        }}
        enablePaging={true}
        horizontal={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f0f0", // A light background color
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
    backgroundColor: "#fff", // PDF viewer area background
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1, // Ensure it's on top
  },
});
