// styles.js
// Al styling er samlet her i en separat fil (jf. opgavekravet).

import { StyleSheet } from "react-native";

// Farvetema inspireret af Premier League.
export const colors = {
  purple: "#37003c",
  purpleLight: "#5a2f63",
  green: "#00ff87",
  white: "#ffffff",
  darkGrey: "#666666",
};

const styles = StyleSheet.create({
  // Generelt
  container: {
    flex: 1,
    backgroundColor: colors.purple,
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.purple,
    padding: 20,
  },

  // Forside
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.green,
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.white,
    textAlign: "center",
    marginBottom: 40,
    lineHeight: 22,
  },

  // Knapper
  button: {
    backgroundColor: colors.green,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    marginBottom: 16,
    width: "100%",
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: colors.purpleLight,
    borderWidth: 2,
    borderColor: colors.green,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: colors.purple,
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonTextSecondary: {
    color: colors.green,
  },

  // Overskrift på liste-skærme
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.green,
    marginBottom: 4,
  },
  headerSub: {
    fontSize: 14,
    color: colors.white,
    marginBottom: 16,
  },

  // Liste-elementer
  card: {
    backgroundColor: colors.white,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  cardBench: {
    opacity: 0.7,
    borderStyle: "dashed",
    borderWidth: 1,
    borderColor: colors.darkGrey,
  },
  positionBadge: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.purple,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  positionText: {
    color: colors.green,
    fontWeight: "bold",
    fontSize: 13,
  },
  cardBody: {
    flex: 1,
  },
  playerName: {
    fontSize: 17,
    fontWeight: "bold",
    color: colors.purple,
  },
  playerMeta: {
    fontSize: 13,
    color: colors.darkGrey,
    marginTop: 2,
  },
  statBox: {
    alignItems: "flex-end",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.purple,
  },
  statLabel: {
    fontSize: 11,
    color: colors.darkGrey,
  },
  benchLabel: {
    fontSize: 11,
    color: colors.darkGrey,
    fontStyle: "italic",
    marginTop: 2,
  },

  // Status (loading / fejl)
  statusText: {
    color: colors.white,
    marginTop: 12,
    fontSize: 15,
    textAlign: "center",
  },
  errorText: {
    color: colors.green,
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
  },

  // Info-tekst på forsiden
  infoText: {
    color: colors.white,
    fontSize: 15,
    marginBottom: 24,
  },
  emptyText: {
    color: colors.white,
    fontSize: 15,
    textAlign: "center",
    marginBottom: 20,
    marginTop: 10,
  },

  // Søgefelt (Byg hold)
  searchInput: {
    backgroundColor: colors.white,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: colors.purple,
    marginBottom: 12,
  },

  // Tilføj/fjern-knap i søgeresultater
  addButton: {
    backgroundColor: colors.green,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addButtonSelected: {
    backgroundColor: colors.purpleLight,
  },
  addButtonText: {
    color: colors.purple,
    fontWeight: "bold",
    fontSize: 14,
  },
  addButtonTextSelected: {
    color: colors.white,
  },

  // Billeder af holdet
  teamPhoto: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 14,
    resizeMode: "cover",
  },
  scanPhoto: {
    width: "100%",
    height: 300,
    borderRadius: 10,
    marginTop: 16,
    resizeMode: "cover",
  },

  // Kaptajn-forslag (Tips)
  captainCard: {
    backgroundColor: colors.green,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  captainLabel: {
    color: colors.purple,
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 4,
  },
  captainName: {
    color: colors.purple,
    fontSize: 22,
    fontWeight: "bold",
  },
  captainMeta: {
    color: colors.purple,
    fontSize: 13,
    marginTop: 2,
  },
});

export default styles;
