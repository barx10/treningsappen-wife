# 💪 Treningsappen - Din Personlige Treningsdagbok

En moderne Progressive Web App (PWA) for treningstracking med detaljert statistikk, anbefalinger og oppsummering av treningsuke.

## 📸 Screenshots

<details>
<summary>Klikk for å se skjermbilder</summary>

| Forside | Dashboard | Profil |
|---------|-----------|--------|
| ![Forside](screenshots/Forside.png) | ![Dashboard](screenshots/Dashboard.png) | ![Profil](screenshots/Profil-treningsmål.png) |

| Ernæring | Treningsstatistikk | Om appen |
|----------|-------------------|----------|
| ![Ernæring](screenshots/Ernæring.png) | ![Treningsstatistikk](screenshots/treningsstatistikk.png) | ![Om appen](screenshots/Om%20appen.png) |

</details>

## ✨ Funksjoner

- 📊 **Treningslogging** - Logg økter med øvelser, sett, reps og vekt
- 📈 **Fremgangsvisualisering** - Se din utvikling med interaktive grafer
- 💡 **Smarte anbefalinger** - Lokale anbefalinger basert på treningshistorikk
- ❤️ **Favorittøkter** - Lagre dine favoritt treningsopplegg for gjenbruk
- ⏱️ **Innebygget timer** - Automatisk hviletid-tracking mellom sett
- 📱 **PWA** - Installer på mobil/desktop, fungerer offline
- 🎨 **Moderne UI** - Dark mode, responsive design

## 🚀 Kom i gang

### Forutsetninger

- Node.js (versjon 18 eller nyere)
- npm eller yarn

### Installasjon

1. **Klon repoet**
   ```bash
   git clone https://github.com/barx10/https-github.com-barx10-treningsappen.git
   cd https-github.com-barx10-treningsappen
   ```

2. **Installer avhengigheter**
   ```bash
   npm install
   ```

3. **Start utviklingsserver**
   ```bash
   npm run dev
   ```

4. **Åpne appen i nettleseren**
   ```
   http://localhost:5173
   ```

## 📦 Bygg for produksjon

```bash
npm run build
```

Bygget ender opp i `dist/` mappen.

## 🌐 Deploy til Vercel

1. **Push til GitHub** (hvis ikke allerede gjort)

2. **Gå til [Vercel](https://vercel.com)**
   - Logg inn med GitHub
   - Klikk "Add New Project"
   - Import ditt repository

3. **Deploy**
   - Vercel vil automatisk bygge og deploye
   - Fremtidige pushes til main-branch vil automatisk deployes

## 🛠️ Teknologi

- **Frontend:** React 19, TypeScript, Vite
- **Styling:** Tailwind CSS 4
- **Charts:** Recharts
- **Icons:** Lucide React
- **PWA:** vite-plugin-pwa
- **Deployment:** Vercel

## 📱 Bruk som PWA

### På mobil (iOS/Android):
1. Åpne appen i Safari/Chrome
2. Trykk "Del" / "Meny"
3. Velg "Legg til på hjemskjerm"

### På desktop:
1. Åpne appen i Chrome/Edge
2. Klikk på install-ikonet i adressefeltet
3. Eller: Meny → "Installer [appnavn]"

## 📁 Prosjektstruktur

```
├── components/
│   ├── ActiveSessionView.tsx  # Aktiv treningsøkt
│   ├── ExerciseCard.tsx       # Øvelseskort
│   ├── ProfileView.tsx        # Brukerprofil og innstillinger
│   ├── FavoritesModal.tsx     # Favorittøkter
│   └── ...
├── utils/
│   ├── storage.ts             # LocalStorage handling
│   ├── initialData.ts         # Standardøvelser
│   └── fitnessCalculations.ts # 1RM, volum, etc.
├── App.tsx                    # Hovedapp
└── types.ts                   # TypeScript types
```

## 🔒 Personvern

- ✅ **All data lagres lokalt** på din enhet (ingen database)
- ✅ **Ingen brukerkontoer** - ingen registrering, ingen e-post
- ✅ **100% privat** - ingen data sendes til eksterne tjenester
- ✅ **Ingen tracking** - ingen cookies, ingen analytics
- ✅ **Full kontroll** - eksporter, importer eller slett alt når du vil

📋 **[Les fullstendig personvernerklæring](PRIVACY.md)**

## 📄 Lisens

MIT License - bruk fritt, men gi gjerne credits! 😊

## 👨‍💻 Laget av

Kenneth Bareksten - [Lærerliv](https://www.laererliv.no/)

## 🙏 Credits

- Vercel for hosting
- React, TypeScript, Tailwind CSS communities

---

**Liker du prosjektet?** Gi det en ⭐ på GitHub!
