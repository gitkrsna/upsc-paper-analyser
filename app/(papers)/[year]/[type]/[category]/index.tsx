import * as Asset from "expo-asset";
import * as FileSystem from "expo-file-system";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import Pdf from "react-native-pdf";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// Sample paper data (hardcoded for now)
const getPaperData = (year: string, type: string, category: string) => {
  // In a real app, this would come from an API or database
  // For now, we're using our single PDF for all options
  return [
    {
      id: "1",
      title: `UPSC ${
        type === "prelims" ? "Preliminary" : "Main"
      } Exam ${year} - ${category.toUpperCase()}`,
      pdf: "General_Studies_Paper_I.pdf",
    },
  ];
};

export default function PaperCategoryScreen() {
    const { year, type, category } = useLocalSearchParams();
    console.log("Params:", year, type, category);
  const papers = getPaperData(
    year as string,
    type as string,
    category as string
  );

  const [selectedPaper, setSelectedPaper] = useState<null | (typeof papers)[0]>(
    null
  );
  const [localPath, setLocalPath] = useState<string | null>(null);

  useEffect(() => {
    if (selectedPaper) {
      const loadPDF = async () => {
        try {
          // 1. Load PDF from assets using absolute import path
          const asset = Asset.Asset.fromModule(
            require("@/assets/General_Studies_Paper_I.pdf")
          );
          await asset.downloadAsync(); // ensure it's loaded

          // 2. Copy to filesystem (only needed once)
          const dest = FileSystem.documentDirectory + selectedPaper.pdf;
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
    }
  }, [selectedPaper]);

  // When first loaded, automatically select the first paper
  useEffect(() => {
    if (papers.length > 0 && !selectedPaper) {
      setSelectedPaper(papers[0]);
    }
  }, [papers, selectedPaper]);

  if (!selectedPaper) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>No papers available for this category.</ThemedText>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ThemedText type="defaultSemiBold">Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  if (!localPath) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {selectedPaper.title}
        </ThemedText>
      </ThemedView>
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
  container: {
    flex: 1,
    padding: 0,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  title: {
    fontSize: 16,
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
  backButton: {
    marginTop: 16,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    alignItems: "center",
  },
});
