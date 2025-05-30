import { Stack } from "expo-router";
import React from "react";

export default function PapersLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "UPSC Papers" }} />
      <Stack.Screen
        name="[year]/index"
        options={{ title: "Select Paper Type" }}
      />
      <Stack.Screen
        name="[year]/[type]/index"
        options={{ title: "Select Paper Category" }}
      />
      <Stack.Screen
        name="[year]/[type]/[category]/index"
        options={{ title: "Papers" }}
      />
    </Stack>
  );
}
