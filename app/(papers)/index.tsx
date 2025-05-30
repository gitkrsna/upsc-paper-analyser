import { router } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// Available years (hardcoded for now)
const years = ["2023", "2022", "2021", "2020", "2019"];

export default function PapersScreen() {
  const navigateToYear = (year: string) => {
    router.push(`/(papers)/${year}`);
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">UPSC Paper Archive</ThemedText>
        <ThemedText style={styles.subtitle}>Select examination year</ThemedText>
      </ThemedView>

      <ThemedView style={styles.yearGrid}>
        {years.map((year) => (
          <TouchableOpacity
            key={year}
            onPress={() => navigateToYear(year)}
            activeOpacity={0.7}
          >
            <ThemedView style={styles.yearCard}>
              <ThemedText type="defaultSemiBold" style={styles.yearText}>
                {year}
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
  yearGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  yearCard: {
    width: "48%",
    padding: 20,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  yearText: {
    fontSize: 20,
  },
});
