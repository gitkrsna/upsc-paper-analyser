import { router, useLocalSearchParams } from "expo-router";
import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

// Available paper types (hardcoded for now)
const paperTypes = [
  { id: "prelims", name: "Preliminary Examination" },
  { id: "mains", name: "Main Examination" },
];

export default function YearScreen() {
  const { year } = useLocalSearchParams();

  const navigateToType = (typeId: string) => {
    router.push(`/(papers)/${year}/${typeId}`);
  };

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">UPSC {year} Papers</ThemedText>
        <ThemedText style={styles.subtitle}>Select examination type</ThemedText>
      </ThemedView>

      <ThemedView style={styles.typeList}>
        {paperTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            onPress={() => navigateToType(type.id)}
            activeOpacity={0.7}
          >
            <ThemedView style={styles.typeCard}>
              <ThemedText type="defaultSemiBold" style={styles.typeTitle}>
                {type.name}
              </ThemedText>
              <ThemedText style={styles.typeDescription}>
                {type.id === "prelims"
                  ? "Objective type questions to test general awareness"
                  : "Descriptive papers to test in-depth knowledge"}
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
  typeList: {
    gap: 16,
  },
  typeCard: {
    padding: 20,
    borderRadius: 12,
    backgroundColor: "#f0f0f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  typeTitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  typeDescription: {
    opacity: 0.7,
  },
});
