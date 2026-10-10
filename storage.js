// storage.js
// Lokal lagring med AsyncStorage, så brugerens data huskes efter appen lukkes.
// (Opfylder kravet om at gemme data der ikke bare er hardcodet.)

import AsyncStorage from "@react-native-async-storage/async-storage";

const TEAM_KEY = "@fpl_my_team";
const PHOTO_KEY = "@fpl_team_photo";

// --- Brugerens hold (liste af spillere) ---
export async function getMyTeam() {
  try {
    const raw = await AsyncStorage.getItem(TEAM_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveMyTeam(players) {
  await AsyncStorage.setItem(TEAM_KEY, JSON.stringify(players));
}

// --- Billede af brugerens rigtige hold (gemmes som en fil-URI) ---
export async function getTeamPhoto() {
  try {
    return await AsyncStorage.getItem(PHOTO_KEY);
  } catch {
    return null;
  }
}

export async function saveTeamPhoto(uri) {
  await AsyncStorage.setItem(PHOTO_KEY, uri);
}
