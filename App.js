// App.js
// Sætter navigationen op mellem de tre skærme (stack-navigation).

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";

import { HomeScreen, SquadScreen, TipsScreen } from "./screens";
import { colors } from "./styles";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: colors.purple },
          headerTintColor: colors.green,
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "FPL Agent" }}
        />
        <Stack.Screen
          name="Squad"
          component={SquadScreen}
          options={{ title: "Mit hold" }}
        />
        <Stack.Screen
          name="Tips"
          component={TipsScreen}
          options={{ title: "Dagens tips" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
