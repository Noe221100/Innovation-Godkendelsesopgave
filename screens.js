// screens.js
// Appens fem skærme: Forside, Mit hold, Byg hold, Scan og Dagens tips.

import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";

import styles, { colors } from "./styles";
import { getAllPlayers, getTips } from "./fpl";
import {
  getMyTeam,
  saveMyTeam,
  getTeamPhoto,
  saveTeamPhoto,
} from "./storage";

const MAX_PLAYERS = 15;

// Lille genbrugelig spiller-række til listerne.
function PlayerCard({ item, badge, right, bench }) {
  return (
    <View style={[styles.card, bench && styles.cardBench]}>
      <View style={styles.positionBadge}>
        <Text style={styles.positionText}>{badge}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.playerName}>{item.name}</Text>
        <Text style={styles.playerMeta}>
          {item.position} · {item.team} · {item.price}
        </Text>
        {bench && <Text style={styles.benchLabel}>Udskifter</Text>}
      </View>
      {right}
    </View>
  );
}

// ============================================================
// 1) FORSIDE
// ============================================================
export function HomeScreen({ navigation }) {
  const [count, setCount] = useState(0);

  // Opdater antal valgte spillere hver gang skærmen vises.
  useFocusEffect(
    useCallback(() => {
      getMyTeam().then((team) => setCount(team.length));
    }, [])
  );

  return (
    <View style={styles.centered}>
      <Text style={styles.title}>FPL Agent</Text>
      <Text style={styles.subtitle}>
        Din hjælper til Fantasy Premier League.{"\n"}
        Byg dit hold, scan det og få dagens bedste tips.
      </Text>

      <Text style={styles.infoText}>Dit hold: {count}/{MAX_PLAYERS} spillere valgt</Text>

      {/* Knap 1 */}
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={() => navigation.navigate("Byg hold")}
      >
        <Text style={styles.buttonText}>Byg mit hold</Text>
      </Pressable>

      {/* Knap 2 */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.buttonSecondary,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => navigation.navigate("Scan")}
      >
        <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
          Scan mit rigtige hold
        </Text>
      </Pressable>
    </View>
  );
}

// ============================================================
// 2) MIT HOLD (viser brugerens gemte hold fra AsyncStorage)
// ============================================================
export function SquadScreen({ navigation }) {
  const [team, setTeam] = useState([]);
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        setLoading(true);
        const [savedTeam, savedPhoto] = await Promise.all([
          getMyTeam(),
          getTeamPhoto(),
        ]);
        if (active) {
          setTeam(savedTeam);
          setPhoto(savedPhoto);
          setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  // Tomt hold -> opfordr til at bygge et.
  if (team.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>
          Du har ikke bygget et hold endnu.
        </Text>
        <Pressable
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
          onPress={() => navigation.navigate("Byg hold")}
        >
          <Text style={styles.buttonText}>Byg mit hold</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mit hold</Text>
      <Text style={styles.headerSub}>
        {team.length} spillere{team.length > 11 ? " (de sidste 4 er udskiftere)" : ""}
      </Text>
      <FlatList
        data={team}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          photo ? (
            <Image source={{ uri: photo }} style={styles.teamPhoto} />
          ) : null
        }
        renderItem={({ item, index }) => (
          <PlayerCard
            item={item}
            badge={item.position}
            bench={index >= 11}
            right={
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{item.points}</Text>
                <Text style={styles.statLabel}>point</Text>
              </View>
            }
          />
        )}
      />
    </View>
  );
}

// ============================================================
// 3) BYG HOLD (søg i spillere + gem hold) - NY funktionalitet
// ============================================================
export function BuildScreen() {
  const [allPlayers, setAllPlayers] = useState([]);
  const [query, setQuery] = useState("");
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  async function loadData() {
    try {
      setLoading(true);
      setError(null);
      const [players, savedTeam] = await Promise.all([
        getAllPlayers(),
        getMyTeam(),
      ]);
      setAllPlayers(players);
      setTeam(savedTeam);
    } catch (e) {
      setError(e.message || "Noget gik galt");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const inTeam = (id) => team.some((p) => p.id === id);

  function toggle(player) {
    setSaved(false);
    if (inTeam(player.id)) {
      setTeam(team.filter((p) => p.id !== player.id));
    } else if (team.length >= MAX_PLAYERS) {
      Alert.alert("Holdet er fuldt", `Du kan højst vælge ${MAX_PLAYERS} spillere.`);
    } else {
      setTeam([...team, player]);
    }
  }

  async function save() {
    await saveMyTeam(team);
    setSaved(true);
  }

  // Søgeresultater (filtrerer på navn). Viser max 30 for overblik.
  const results =
    query.trim().length > 0
      ? allPlayers
          .filter((p) =>
            p.name.toLowerCase().includes(query.trim().toLowerCase())
          )
          .slice(0, 30)
      : [];

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.green} />
        <Text style={styles.statusText}>Henter spillere...</Text>
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
      <Text style={styles.header}>Byg hold</Text>
      <Text style={styles.headerSub}>
        Søg efter spillere og tilføj dem til dit hold ({team.length}/{MAX_PLAYERS})
      </Text>

      {/* Søgefelt */}
      <TextInput
        style={styles.searchInput}
        placeholder="Søg efter spiller..."
        placeholderTextColor={colors.darkGrey}
        value={query}
        onChangeText={setQuery}
        autoCorrect={false}
      />

      {/* Gem-knap */}
      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={save}
      >
        <Text style={styles.buttonText}>
          {saved ? "Hold gemt ✓" : "Gem hold"}
        </Text>
      </Pressable>

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>
            {query.trim().length > 0
              ? "Ingen spillere matcher søgningen."
              : "Skriv i søgefeltet for at finde spillere."}
          </Text>
        }
        renderItem={({ item }) => {
          const selected = inTeam(item.id);
          return (
            <PlayerCard
              item={item}
              badge={item.position}
              right={
                <Pressable
                  style={({ pressed }) => [
                    styles.addButton,
                    selected && styles.addButtonSelected,
                    pressed && styles.buttonPressed,
                  ]}
                  onPress={() => toggle(item)}
                >
                  <Text
                    style={[
                      styles.addButtonText,
                      selected && styles.addButtonTextSelected,
                    ]}
                  >
                    {selected ? "Fjern" : "Tilføj"}
                  </Text>
                </Pressable>
              }
            />
          );
        }}
      />
    </View>
  );
}

// ============================================================
// 4) SCAN (tag/vælg et billede af dit rigtige hold) - KAMERA
// ============================================================
export function ScanScreen() {
  const [photo, setPhoto] = useState(null);

  useFocusEffect(
    useCallback(() => {
      getTeamPhoto().then(setPhoto);
    }, [])
  );

  async function takePhoto() {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Adgang nægtet", "Appen skal have adgang til kameraet.");
      return;
    }
    const res = await ImagePicker.launchCameraAsync({ quality: 0.5 });
    if (!res.canceled) {
      const uri = res.assets[0].uri;
      await saveTeamPhoto(uri);
      setPhoto(uri);
    }
  }

  async function pickPhoto() {
    const res = await ImagePicker.launchImageLibraryAsync({ quality: 0.5 });
    if (!res.canceled) {
      const uri = res.assets[0].uri;
      await saveTeamPhoto(uri);
      setPhoto(uri);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Scan mit hold</Text>
      <Text style={styles.headerSub}>
        Tag et billede af dit rigtige FPL-hold, så du har det som reference.
      </Text>

      <Pressable
        style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
        onPress={takePhoto}
      >
        <Text style={styles.buttonText}>Tag billede</Text>
      </Pressable>

      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.buttonSecondary,
          pressed && styles.buttonPressed,
        ]}
        onPress={pickPhoto}
      >
        <Text style={[styles.buttonText, styles.buttonTextSecondary]}>
          Vælg fra galleri
        </Text>
      </Pressable>

      {photo ? (
        <Image source={{ uri: photo }} style={styles.scanPhoto} />
      ) : (
        <Text style={styles.emptyText}>Intet billede gemt endnu.</Text>
      )}
    </View>
  );
}

// ============================================================
// 5) DAGENS TIPS (spillere i form + kaptajn-forslag)
// ============================================================
export function TipsScreen() {
  const [tips, setTips] = useState([]);
  const [captain, setCaptain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useFocusEffect(
    useCallback(() => {
      let active = true;
      (async () => {
        try {
          setLoading(true);
          setError(null);
          const [formPlayers, myTeam] = await Promise.all([
            getTips(),
            getMyTeam(),
          ]);
          if (!active) return;
          setTips(formPlayers);
          // Kaptajn-forslag: bedste form blandt dine egne spillere,
          // ellers blandt de bedste i ligaen.
          const pool = myTeam.length > 0 ? myTeam : formPlayers;
          const best = [...pool].sort((a, b) => b.form - a.form)[0];
          setCaptain(best || null);
        } catch (e) {
          if (active) setError(e.message || "Noget gik galt");
        } finally {
          if (active) setLoading(false);
        }
      })();
      return () => {
        active = false;
      };
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colors.green} />
        <Text style={styles.statusText}>Henter tips...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Dagens tips</Text>
      <Text style={styles.headerSub}>Spillere i bedst form lige nu</Text>

      {captain && (
        <View style={styles.captainCard}>
          <Text style={styles.captainLabel}>Foreslået kaptajn</Text>
          <Text style={styles.captainName}>{captain.name}</Text>
          <Text style={styles.captainMeta}>
            {captain.position} · {captain.team} · form {captain.form}
          </Text>
        </View>
      )}

      <FlatList
        data={tips}
        keyExtractor={(item) => String(item.id)}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <PlayerCard
            item={item}
            badge={`#${index + 1}`}
            right={
              <View style={styles.statBox}>
                <Text style={styles.statValue}>{item.form}</Text>
                <Text style={styles.statLabel}>form</Text>
              </View>
            }
          />
        )}
      />
    </View>
  );
}
