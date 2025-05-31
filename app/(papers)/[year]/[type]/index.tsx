import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { getPaperCategories } from "@/utils/paperUtils";

export default function TypeScreen() {
  const { year, type } = useLocalSearchParams();
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load paper categories for this year and type
    const paperCategories = getPaperCategories(type as string, year as string);
    setCategories(paperCategories);
    setLoading(false);
  }, [year, type]);

  const navigateToCategory = (categoryId: string) => {
    router.push(`/(papers)/${year}/${type}/${categoryId}`);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <ThemedText style={{ marginTop: 10 }}>
          Loading paper categories...
        </ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">
          {type === "prelims" ? "Preliminary" : "Main"} Examination {year}
        </ThemedText>
        <ThemedText style={styles.subtitle}>Select paper category</ThemedText>
      </ThemedView>

      {categories.length === 0 ? (
        <ThemedView style={styles.noContent}>
          <ThemedText>
            No paper categories available for {year} {type} examination.
          </ThemedText>
        </ThemedView>
      ) : (
        <ThemedView style={styles.categoryList}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => navigateToCategory(category.id)}
              activeOpacity={0.7}
            >
              <ThemedView style={styles.categoryCard}>
                <ThemedText type="defaultSemiBold" style={styles.categoryTitle}>
                  {category.name}
                </ThemedText>
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ThemedView>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
  },
  noContent: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryList: {
    gap: 12,
  },
  categoryCard: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryTitle: {
    fontSize: 16,
  },
});
