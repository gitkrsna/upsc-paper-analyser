import { Stack } from "expo-router";
import React from "react";

export default function PapersLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: "#f5f5f5",
        },
        headerTintColor: "#333",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerShadowVisible: true,
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen name="index" options={{ headerTitle: "UPSC Papers" }} />
      <Stack.Screen
        name="[year]/index"
        options={{ headerTitle: "Select Paper Type" }}
      />
      <Stack.Screen
        name="[year]/[type]/index"
        options={{ headerTitle: "Select Paper Category" }}
      />
      <Stack.Screen
        name="[year]/[type]/[category]/index"
        options={{ headerTitle: "View Paper" }}
      />
      <Stack.Screen
        name="[year]/[type]/[category]/[filename]"
        options={{ headerTitle: "" }}
      />
    </Stack>
  );
}
