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
import { PaperInfo, getPapers, loadPaperForViewing } from "@/utils/paperUtils";

export default function PaperCategoryScreen() {
  const { year, type, category } = useLocalSearchParams();
  console.log("Params:", year, type, category);

  const [papers, setPapers] = useState<PaperInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPaper, setSelectedPaper] = useState<PaperInfo | null>(null);
  const [localPath, setLocalPath] = useState<string | null>(null);

  // Load papers for this category
  useEffect(() => {
    const loadPapers = async () => {
      try {
        const availablePapers = getPapers(
          year as string,
          type as string,
          category as string
        );

        setPapers(availablePapers);

        // Automatically select the first paper if available
        if (availablePapers.length > 0) {
          setSelectedPaper(availablePapers[0]);
        }
      } catch (error) {
        console.error("Failed to load papers:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPapers();
  }, [year, type, category]);

  // Load the selected paper for viewing
  useEffect(() => {
    if (selectedPaper) {
      const loadPDF = async () => {
        try {
          const pdfPath = await loadPaperForViewing(selectedPaper);
          setLocalPath(pdfPath);
        } catch (err) {
          console.error("Failed to load local PDF:", err);
        }
      };

      loadPDF();
    }
  }, [selectedPaper]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0000ff" />
        <ThemedText style={{ marginTop: 10 }}>Loading papers...</ThemedText>
      </View>
    );
  }

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
        <ThemedText style={{ marginTop: 10 }}>
          Preparing PDF viewer...
        </ThemedText>
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

      {papers.length > 1 && (
        <ThemedView style={styles.paperSelector}>
          {papers.map((paper) => (
            <TouchableOpacity
              key={paper.id}
              style={[
                styles.paperOption,
                selectedPaper.id === paper.id && styles.selectedPaper,
              ]}
              onPress={() => setSelectedPaper(paper)}
            >
              <ThemedText
                type="defaultSemiBold"
                style={
                  selectedPaper.id === paper.id ? styles.selectedPaperText : {}
                }
              >
                {paper.title}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      )}
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
  paperSelector: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#e0e0e0",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 10,
  },
  paperOption: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#f0f0f0",
  },
  selectedPaper: {
    backgroundColor: "#007AFF",
  },
  selectedPaperText: {
    color: "#fff",
  },
});
