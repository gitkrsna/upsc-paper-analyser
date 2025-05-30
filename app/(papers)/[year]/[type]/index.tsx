import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// Available paper categories (hardcoded for now)
const getCategories = (type: string) => {
  if (type === "prelims") {
    return [
      { id: "gs1", name: "General Studies Paper I" },
      { id: "gs2", name: "General Studies Paper II (CSAT)" },
    ];
  } else {
    return [
      { id: "gs1", name: "General Studies Paper I" },
      { id: "gs2", name: "General Studies Paper II" },
      { id: "gs3", name: "General Studies Paper III" },
      { id: "gs4", name: "General Studies Paper IV" },
      { id: "essay", name: "Essay" },
    ];
  }
};

export default function TypeScreen() {
  const { year, type } = useLocalSearchParams();
  const categories = getCategories(type as string);

  const navigateToCategory = (categoryId: string) => {
    router.push(`/(papers)/${year}/${type}/${categoryId}`);
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">
          {type === "prelims" ? "Preliminary" : "Main"} Examination {year}
        </ThemedText>
        <ThemedText style={styles.subtitle}>Select paper category</ThemedText>
      </ThemedView>

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
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  subtitle: {
    marginTop: 8,
    opacity: 0.7,
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
