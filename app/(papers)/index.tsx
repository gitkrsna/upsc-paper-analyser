import { router } from "expo-router";
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
import { getYears } from "@/utils/paperUtils";

export default function PapersScreen() {
  const [years, setYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadYears = async () => {
      try {
        const availableYears = await getYears();
        setYears(availableYears);
      } catch (error) {
        console.error("Failed to load years:", error);
      } finally {
        setLoading(false);
      }
    };

    loadYears();
  }, []);

  const navigateToYear = (year: string) => {
    console.log(`Navigating to year: ${year}`);
    router.push(`/(papers)/${year}`);
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
        <ThemedText style={{ marginTop: 10 }}>Loading years...</ThemedText>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title">UPSC Paper Archive</ThemedText>
        <ThemedText style={styles.subtitle}>Select examination year</ThemedText>
      </ThemedView>

      {years.length === 0 ? (
        <ThemedView style={styles.noContent}>
          <ThemedText>No examination years available.</ThemedText>
        </ThemedView>
      ) : (
        <ThemedView style={styles.yearGrid}>
          {years.map((year) => (
            <TouchableOpacity
              key={year}
              style={styles.touchable}
              onPress={() => navigateToYear(year)}
              activeOpacity={0.7}
            >
              <ThemedView style={styles.yearCard}>
                <ThemedText type="subtitle" style={styles.yearText}>
                  {year}
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
  yearGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  touchable: {
    width: "48%",
    marginBottom: 16,
  },
  yearCard: {
    padding: 20,
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
    fontSize: 24,
    color: "#333",
  },
});
