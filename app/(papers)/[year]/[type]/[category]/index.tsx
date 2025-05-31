import { Link, useLocalSearchParams, useRouter } from "expo-router"; // Added useRouter, Link
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
// Removed Pdf from "react-native-pdf"
// Removed Dimensions

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PaperInfo, getPapers } from "../../../../../utils/paperUtils";

export default function PaperCategoryScreen() {
  const router = useRouter(); // Initialize router
  const { year, type, category } = useLocalSearchParams();
  console.log("Params:", year, type, category);

  const [papers, setPapers] = useState<PaperInfo[]>([]);
  const [loading, setLoading] = useState(true);
  // Removed selectedPaper state
  // Removed localPath state

  // Load papers for this category and navigate if needed
  useEffect(() => {
    let isMounted = true;

    const loadPapersAndNavigate = async () => {
      if (!isMounted) return;
      setLoading(true);

      try {
        // Ensure params are strings and exist
        const currentYear = Array.isArray(year) ? year[0] : year;
        const currentType = Array.isArray(type) ? type[0] : type;
        const currentCategory = Array.isArray(category)
          ? category[0]
          : category;

        if (!currentYear || !currentType || !currentCategory) {
          console.warn(
            "PaperCategoryScreen: Missing required parameters (year, type, or category)."
          );
          if (isMounted) {
            setPapers([]);
            setLoading(false);
          }
          return;
        }

        const availablePapers = getPapers(
          currentYear,
          currentType,
          currentCategory
        );

        if (!isMounted) return;

        setPapers(availablePapers);

        if (availablePapers.length === 1 && availablePapers[0]?.requirePath) {
          // If only one paper, navigate directly to the viewer
          const paperToView = availablePapers[0];
          if (isMounted) { // Ensure component is still mounted before state update
            setLoading(false); // Explicitly set loading to false before navigation
          }
          router.push(`/(papers)/${year}/${type}/${category}/${encodeURIComponent(paperToView.requirePath)}`);
          return;
        }
      } catch (error) {
        console.error("Failed to load papers:", error);
        if (isMounted) {
          setPapers([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPapersAndNavigate();

    return () => {
      isMounted = false;
    };
  }, [year, type, category, router]);

  // Removed useEffect for localPath

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
        <ThemedText style={{ marginTop: 10 }}>Loading papers...</ThemedText>
      </View>
    );
  }

  // If execution reaches here after loading, and papers.length is not 1 (or was 1 but navigation hasn't completed/unmounted yet)
  // We primarily handle the > 0 or 0 cases for displaying list or "no papers" message.
  // The single paper case is mostly handled by navigation in useEffect.

  if (papers.length === 0) {
    return (
      <ThemedView style={styles.centeredMessageContainer}>
        <ThemedText type="subtitle">
          No papers found for this category.
        </ThemedText>
        <ThemedText>
          {`${decodeURIComponent(
            category as string
          )} - ${year} (${decodeURIComponent(type as string)})`}
        </ThemedText>
      </ThemedView>
    );
  }

  // If papers.length > 0 (and not the single paper case that should have navigated)
  // Display list of papers
  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.pageTitle}>
          {`${decodeURIComponent(category as string)}`}
        </ThemedText>
        <ThemedText style={styles.subHeader}>
          {`${year} - ${decodeURIComponent(type as string)} Papers`}
        </ThemedText>
        <ThemedText style={styles.instructions}>
          Please select a paper to view:
        </ThemedText>
      </View>

      <FlatList
        data={papers}
        keyExtractor={(item) => item.id.toString()} // Assuming PaperInfo has a unique id
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/pdf-viewer",
              params: { uri: encodeURIComponent(item.requirePath) },
            }}
            asChild
          >
            <TouchableOpacity style={styles.paperItem}>
              <ThemedText type="defaultSemiBold" style={styles.paperItemTitle}>
                {item.title}
              </ThemedText>
              <ThemedText style={styles.paperItemSubtitle}>
                {item.fileName}
              </ThemedText>
            </TouchableOpacity>
          </Link>
        )}
        contentContainerStyle={styles.listContentContainer}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F4F7FC", // Light background for the whole screen
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E8E8E8",
  },
  pageTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2C3E50", // Darker, more professional title color
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 16,
    color: "#5A6A7A", // Subdued color for secondary header text
    marginBottom: 8,
  },
  instructions: {
    fontSize: 14,
    color: "#7F8C9A", // Lighter color for instructional text
  },
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F4F7FC",
  },
  centeredMessageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#F4F7FC",
  },
  listContentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  paperItem: {
    backgroundColor: "#FFFFFF",
    padding: 20, // Generous padding
    borderRadius: 12,
    marginBottom: 16, // Space between items
    shadowColor: "#B0C4DE", // Softer shadow color
    shadowOffset: {
      width: 0,
      height: 3, // Slightly more pronounced shadow
    },
    shadowOpacity: 0.3, // More visible shadow
    shadowRadius: 4.65,
    elevation: 6, // Elevation for Android
    borderWidth: 1, // Subtle border
    borderColor: "#E0E7FF", // Light border color
  },
  paperItemTitle: {
    fontSize: 17,
    fontWeight: "600", // Semi-bold
    color: "#34495E", // Strong title color for items
    marginBottom: 4,
  },
  paperItemSubtitle: {
    fontSize: 13,
    color: "#7F8C9A", // Lighter color for subtitle/filename
  },
  // Removed styles: pdf, paperSelector, paperOption, selectedPaper, selectedPaperText, title (old one)
});
