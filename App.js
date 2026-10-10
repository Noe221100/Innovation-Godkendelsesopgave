// App.js
// Sætter navigationen op med bund-tabs mellem appens fem skærme.

import React from "react";
import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "expo-status-bar";

import {
  HomeScreen,
  SquadScreen,
  BuildScreen,
  ScanScreen,
  TipsScreen,
} from "./screens";
import { colors } from "./styles";

const Tab = createBottomTabNavigator();

// Lille hjælper: viser et emoji-ikon i tab-baren.
const icon = (emoji) => () => <Text style={{ fontSize: 18 }}>{emoji}</Text>;

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        initialRouteName="Hjem"
        screenOptions={{
          headerStyle: { backgroundColor: colors.purple },
          headerTintColor: colors.green,
          headerTitleStyle: { fontWeight: "bold" },
          tabBarActiveTintColor: colors.purple,
          tabBarInactiveTintColor: colors.darkGrey,
        }}
      >
        <Tab.Screen
          name="Hjem"
          component={HomeScreen}
          options={{ title: "FPL Agent", tabBarIcon: icon("🏠") }}
        />
        <Tab.Screen
          name="Mit hold"
          component={SquadScreen}
          options={{ tabBarIcon: icon("👕") }}
        />
        <Tab.Screen
          name="Byg hold"
          component={BuildScreen}
          options={{ tabBarIcon: icon("🔍") }}
        />
        <Tab.Screen
          name="Scan"
          component={ScanScreen}
          options={{ tabBarIcon: icon("📷") }}
        />
        <Tab.Screen
          name="Tips"
          component={TipsScreen}
          options={{ tabBarIcon: icon("⭐") }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
