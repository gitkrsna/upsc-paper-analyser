import * as Asset from "expo-asset";
import * as FileSystem from "expo-file-system";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, StyleSheet, View } from "react-native";
import Pdf from "react-native-pdf";

export default function LocalPDFViewer() {
  const [localPath, setLocalPath] = useState<string | null>(null);

  useEffect(() => {
    const loadPDF = async () => {
      try {
        // 1. Load PDF from assets
        const asset = Asset.Asset.fromModule(
          require("../../assets/General_Studies_Paper_I.pdf")
        );
        await asset.downloadAsync(); // ensure it's loaded

        // 2. Copy to filesystem (only needed once)
        const dest =
          FileSystem.documentDirectory + "General_Studies_Paper_I.pdf";
        const file = await FileSystem.getInfoAsync(dest);
        if (!file.exists) {
          await FileSystem.copyAsync({
            from: asset.localUri!,
            to: dest,
          });
        }

        // 3. Set the raw file path
        setLocalPath(dest);
      } catch (err) {
        console.error("Failed to load local PDF:", err);
      }
    };

    loadPDF();
  }, []);

  if (!localPath) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pdf
        source={{ uri: localPath }}
        style={styles.pdf}
        onLoadComplete={(n, filePath) =>
          console.log(`Loaded ${n} pages from ${filePath}`)
        }
        onError={(err) => console.log("PDF load error:", err)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: "center", alignItems: "center" },
  pdf: { flex: 1, width: Dimensions.get("window").width },
});
