# FPL Agent

En simpel mobil-app (React Native + Expo), der fungerer som en hjælper til **Fantasy Premier League**. Idéen er at samle det vigtigste ét sted, så man bruger mindre tid på at hoppe mellem den officielle app, statistiksider og forums.

**GitHub:** https://github.com/Noe221100/Innovation-Godkendelsesopgave

## Demovideo

[Indsæt link til demovideo her]

## Funktioner

Appen har **fem skærme** med bund-tab-navigation:

| Skærm | Beskrivelse |
|-------|-------------|
| **Hjem** | Forside med overblik og knapper til at bygge/scanne hold |
| **Mit hold** | Viser dit eget gemte hold (hentet fra lokal lagring) + evt. billede af dit rigtige hold |
| **Byg hold** | Søg blandt alle spillere fra FPL-API'et og tilføj/fjern dem til dit hold – gemmes lokalt |
| **Scan** | Tag et billede af dit rigtige FPL-hold med kameraet som reference |
| **Tips** | Spillere i bedst form lige nu + forslag til kaptajn |

### Nøgle-funktionalitet
- **Søgefunktion:** søg blandt alle Premier League-spillere.
- **Kamera:** tag/vælg et billede af dit rigtige hold (`expo-image-picker`).
- **Lokal lagring:** dit hold og dit billede gemmes med **AsyncStorage** og huskes efter appen lukkes.
- **Eksternt data:** spillerdata hentes live fra det officielle Fantasy Premier League API.

## Teknologi
- React Native (Expo SDK 57)
- React Navigation (bund-tabs)
- `@react-native-async-storage/async-storage` – lokal lagring
- `expo-image-picker` – kamera/galleri
- Fantasy Premier League API (`https://fantasy.premierleague.com/api/bootstrap-static/`)

## Projektstruktur
```
FPLAgent/
├── App.js         # navigation (bund-tabs) mellem de 5 skærme
├── screens.js     # de 5 skærme
├── fpl.js         # henter spillerdata fra FPL-API'et
├── storage.js     # lokal lagring (AsyncStorage)
├── styles.js      # al styling (separat fil)
├── app.json
└── package.json
```

## Kør appen lokalt
```bash
npm install
npx expo install @react-navigation/bottom-tabs @react-native-async-storage/async-storage expo-image-picker
npx expo start
```
Scan QR-koden med **Expo Go** på din telefon (telefon og computer skal være på samme WiFi).

## Hvem har kodet hvad
- Johan Schaldemose Noe: hele appen (alle fem skærme, navigation, API-integration, lokal lagring og kamera).
