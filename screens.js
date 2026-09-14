// screens.js
// Appens tre skærme: Forside, Mit hold og Dagens tips.

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import styles, { colors } from "./styles";
import { getSquad, getTips } from "./fpl";

// ---------- Forside ----------
export function HomeScreen({ navigation }) {
  return (
    <View style={styles.centered}>
      <Text style={styles.title}>FPL Agent</Text>
      <Text style={styles.subtitle}>
        Din hjælper til Fantasy Premier League.{"\n"}
        Se dit hold og dagens bedste tips ét sted.
      </Text>

      {/* Knap 1: navigerer til "Mit hold" */}
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => navigation.navigate("Squad")}
      >
        <Text style={styles.buttonText}>Se mit hold</Text>
      </Pressable>

      {/* Knap 2: navigerer til "Dagens tips" */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.buttonSecondary,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => navigation.navigate("Tips")}
      >
        <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
          Dagens tips
        </Text>
      </Pressable>
    </View>
  );
}

// ---------- Genbrugelig liste-skærm (bruges af både Mit hold og Tips) ----------
function ListScreen({ title, subtitle, load, renderItem }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      setItems(await load());
    } catch (e) {
      setError(e.message || "Noget gik galt");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.green} />
        <Text style={styles.statusText}>Henter data...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={loadData}
        >
          <Text style={styles.buttonText}>Prøv igen</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{title}</Text>
      <Text style={styles.headerSub}>{subtitle}</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

// ---------- Mit hold ----------
export function SquadScreen() {
  return (
    <ListScreen
      title="Mit hold"
      subtitle="11 på banen + 4 udskiftere"
      load={getSquad}
      renderItem={({ item, index }) => {
        const isBench = index >= 11;
        return (
          <View style={[styles.card, isBench && styles.cardBench]}>
            <View style={styles.positionBadge}>
              <Text style={styles.positionText}>{item.position}</Text>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.playerName}>{item.name}</Text>
              <Text style={styles.playerMeta}>
                {item.team} · {item.price}
              </Text>
              {isBench && <Text style={styles.benchLabel}>Udskifter</Text>}
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{item.points}</Text>
              <Text style={styles.statLabel}>point</Text>
            </View>
          </View>
        );
      }}
    />
  );
}

// ---------- Dagens tips ----------
export function TipsScreen() {
  return (
    <ListScreen
      title="Dagens tips"
      subtitle="Spillere i bedst form lige nu"
      load={getTips}
      renderItem={({ item, index }) => (
        <View style={styles.card}>
          <View style={styles.positionBadge}>
            <Text style={styles.positionText}>#{index + 1}</Text>
          </View>
          <View style={styles.cardBody}>
            <Text style={styles.playerName}>{item.name}</Text>
            <Text style={styles.playerMeta}>
              {item.position} · {item.team} · {item.price}
            </Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statValue}>{item.form}</Text>
            <Text style={styles.statLabel}>form</Text>
          </View>
        </View>
      )}
    />
  );
}
