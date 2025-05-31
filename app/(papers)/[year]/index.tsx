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
import { getPaperTypes } from "@/utils/paperUtils";

export default function YearScreen() {
  const { year } = useLocalSearchParams();
  const [paperTypes, setPaperTypes] = useState<{ id: string; name: string }[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load paper types for this year
    setPaperTypes(getPaperTypes(year as string));
    setLoading(false);
  }, [year]);

  const navigateToType = (typeId: string) => {
    router.push(`/(papers)/${year}/${typeId}`);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <ThemedText style={{ marginTop: 10 }}>
          Loading examination types...
        </ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">UPSC {year} Papers</ThemedText>
        <ThemedText style={styles.subtitle}>Select examination type</ThemedText>
      </ThemedView>

      {paperTypes.length === 0 ? (
        <ThemedView style={styles.noContent}>
          <ThemedText>No examination types available for {year}.</ThemedText>
        </ThemedView>
      ) : (
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
