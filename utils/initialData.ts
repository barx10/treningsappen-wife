import {
  ExerciseDefinition,
  WorkoutSession,
  MuscleGroup,
  ExerciseType,
  WorkoutStatus,
  WorkoutExercise
} from '../types';
import { getTodayDateString, getDateString } from './dateUtils';

// Definerer øvelsene fra programmet ditt + gode alternativer
export const createInitialExercises = (): ExerciseDefinition[] => [
  // --- Oppvarming & Mobilitet ---
  {
    id: 'ex_warmup',
    name: 'Oppvarming (Gå + Dynamisk)',
    muscleGroup: MuscleGroup.CARDIO,
    type: ExerciseType.DURATION,
    description: 'Start med 5 min rolig gange. Siste 2 minutter øker du tempoet. Avslutt med armsirkler, hofterotasjoner og lette knebøy.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Oppvarming'
  },
  {
    id: 'ex_mobility',
    name: 'Mobilitetsøvelser (Tøying)',
    muscleGroup: MuscleGroup.CORE,
    type: ExerciseType.DURATION,
    description: 'Fokuser på dynamisk tøying av hofteleddsbøyer, bryst og bakside lår.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Mobilitet'
  },

  // --- Bein (Baseøvelser) ---
  {
    id: 'ex_squat',
    name: 'Knebøy / Goblet Squat',
    muscleGroup: MuscleGroup.LEGS,
    secondaryMuscleGroups: [MuscleGroup.CORE],
    type: ExerciseType.WEIGHTED,
    description: 'Hold vekten foran brystet. Stå med skulderbreddes avstand. Sett deg ned som om du skal på en stol, hold ryggen rett. Press opp gjennom hælene.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Kneb%C3%B8y'
  },
  {
    id: 'ex_lunges',
    name: 'Utfall (Gående/Stående)',
    muscleGroup: MuscleGroup.LEGS,
    secondaryMuscleGroups: [MuscleGroup.CORE],
    type: ExerciseType.WEIGHTED,
    description: 'Ta et stort steg frem. Senk bakre kne nesten ned i gulvet. Hold overkroppen oppreist. Skyv tilbake til start.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Utfall'
  },
  {
    id: 'ex_legpress',
    name: 'Beinpress',
    muscleGroup: MuscleGroup.LEGS,
    type: ExerciseType.WEIGHTED,
    description: 'Sitt i maskinen med ryggen godt inntil setet. Plasser føttene i skulderbredde på platen. Press platen bort til beina er nesten strake, og senk rolig tilbake.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Beinpress'
  },
  {
    id: 'ex_stepup',
    name: 'Step-ups på kasse',
    muscleGroup: MuscleGroup.LEGS,
    secondaryMuscleGroups: [MuscleGroup.CORE],
    type: ExerciseType.WEIGHTED,
    description: 'Stå foran en kasse eller benk. Sett den ene foten opp på kassen. Press deg opp ved å bruke beinet på kassen, til du står med begge føttene oppe. Senk deg kontrollert ned igjen.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Step-ups'
  },
  {
    id: 'ex_bridge',
    name: 'Hoftehev / Glute Bridge',
    muscleGroup: MuscleGroup.LEGS,
    secondaryMuscleGroups: [MuscleGroup.CORE],
    type: ExerciseType.BODYWEIGHT,
    description: 'Ligg på ryggen med føttene i gulvet. Løft hoften opp mot taket ved å stramme setemusklene. Hold i 1-2 sekunder på toppen.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Hoftehev'
  },
  {
    id: 'ex_bulgarian_split',
    name: 'Bulgarian Split Squat',
    muscleGroup: MuscleGroup.LEGS,
    secondaryMuscleGroups: [MuscleGroup.CORE],
    type: ExerciseType.WEIGHTED,
    description: 'Stå foran en benk. Plasser den ene foten bakover på benken. Senk kroppen ved å bøye det fremre beinet til kneet nesten berører gulvet. Press opp igjen.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Bulgarian+Split'
  },
  {
    id: 'ex_leg_curl',
    name: 'Leg Curl',
    muscleGroup: MuscleGroup.LEGS,
    type: ExerciseType.WEIGHTED,
    description: 'Ligg på magen i leg curl-maskinen. Bøy knærne for å trekke vekten opp mot setet. Senk kontrollert ned.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Leg+Curl'
  },
  {
    id: 'ex_calf_raise',
    name: 'Calf Raises',
    muscleGroup: MuscleGroup.LEGS,
    type: ExerciseType.WEIGHTED,
    description: 'Stå med tærne på en forhøyning. Løft hælene opp så høyt du kan. Senk kontrollert ned igjen.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Calf+Raises'
  },
  {
    id: 'ex_deadlift',
    name: 'Markløft (KB/Stang)',
    muscleGroup: MuscleGroup.BACK,
    secondaryMuscleGroups: [MuscleGroup.LEGS, MuscleGroup.CORE],
    type: ExerciseType.WEIGHTED,
    description: 'Stå med vekten mellom føttene. Bøy i hofta (ikke ryggen) for å gripe vekten. Stram magen, og reis deg opp ved å skyve hofta frem.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Markl%C3%B8ft'
  },
  {
    id: 'ex_rdl',
    name: 'Strake Markløft (Rumensk)',
    muscleGroup: MuscleGroup.LEGS,
    secondaryMuscleGroups: [MuscleGroup.BACK, MuscleGroup.CORE],
    type: ExerciseType.WEIGHTED,
    description: 'Stå med føttene i hoftebredde. Hold stangen/vektene foran lårene. Bøy i hoften og senk vektene ned langs beina mens du holder ryggen rett og beina nesten strake. Kjenn strekken i bakside lår.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Strake+Markl%C3%B8ft'
  },

  // --- Press (Bryst/Skuldre) ---
  {
    id: 'ex_pushup',
    name: 'Armhevinger',
    muscleGroup: MuscleGroup.CHEST,
    secondaryMuscleGroups: [MuscleGroup.ARMS, MuscleGroup.SHOULDERS, MuscleGroup.CORE],
    type: ExerciseType.BODYWEIGHT,
    description: 'Plasser hendene litt bredere enn skuldrene. Hold kroppen strak som en planke. Senk brystet mot gulvet og skyv opp.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Armhevinger'
  },
  {
    id: 'ex_bench',
    name: 'Benkpress',
    muscleGroup: MuscleGroup.CHEST,
    secondaryMuscleGroups: [MuscleGroup.ARMS, MuscleGroup.SHOULDERS],
    type: ExerciseType.WEIGHTED,
    description: 'Ligg på benken. Senk stangen kontrollert ned til brystet. Press stangen opp til armene er strake.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Benkpress'
  },
  {
    id: 'ex_incline_press',
    name: 'Incline Press',
    muscleGroup: MuscleGroup.CHEST,
    secondaryMuscleGroups: [MuscleGroup.ARMS, MuscleGroup.SHOULDERS],
    type: ExerciseType.WEIGHTED,
    description: 'Ligg på en skråbenk (30-45 grader). Press manualene eller stangen opp fra brystet til armene er strake.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Incline+Press'
  },
  {
    id: 'ex_cable_fly',
    name: 'Cable Flies',
    muscleGroup: MuscleGroup.CHEST,
    secondaryMuscleGroups: [MuscleGroup.SHOULDERS],
    type: ExerciseType.WEIGHTED,
    description: 'Stå mellom to kabelstasjoner med armene ut til siden. Trekk hendene sammen foran brystet i en bueformet bevegelse.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Cable+Flies'
  },
  {
    id: 'ex_press',
    name: 'Skulderpress',
    muscleGroup: MuscleGroup.SHOULDERS,
    secondaryMuscleGroups: [MuscleGroup.ARMS, MuscleGroup.CORE],
    type: ExerciseType.WEIGHTED,
    description: 'Press manualene eller stangen fra skuldrene og rett opp over hodet. Senk kontrollert ned igjen.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Skulderpress'
  },
  {
    id: 'ex_arnold_press',
    name: 'Arnold Press',
    muscleGroup: MuscleGroup.SHOULDERS,
    secondaryMuscleGroups: [MuscleGroup.ARMS, MuscleGroup.CORE],
    type: ExerciseType.WEIGHTED,
    description: 'Sitt med manualene foran skuldrene, håndflater mot deg. Roter håndleddene mens du presser vektene opp over hodet.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Arnold+Press'
  },
  {
    id: 'ex_lateral',
    name: 'Sidehev',
    muscleGroup: MuscleGroup.SHOULDERS,
    type: ExerciseType.WEIGHTED,
    description: 'Stå med en manual i hver hånd. Løft armene rett ut til siden til de er på høyde med skuldrene. Senk rolig ned igjen.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Sidehev'
  },
  {
    id: 'ex_dips',
    name: 'Dips',
    muscleGroup: MuscleGroup.ARMS,
    secondaryMuscleGroups: [MuscleGroup.CHEST, MuscleGroup.SHOULDERS],
    type: ExerciseType.BODYWEIGHT,
    description: 'Hold i stengene med strake armer. Senk kroppen ned ved å bøye i albuene til overarmene er parallelle med gulvet. Press opp igjen.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Dips'
  },

  // --- Trekk (Rygg) ---
  {
    id: 'ex_row',
    name: 'Roing',
    muscleGroup: MuscleGroup.BACK,
    secondaryMuscleGroups: [MuscleGroup.ARMS, MuscleGroup.CORE],
    type: ExerciseType.WEIGHTED,
    description: 'Len deg fremover med rett rygg. Trekk vekten opp mot nedre del av magen. Klem skulderbladene sammen.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Roing'
  },
  {
    id: 'ex_lat_row',
    name: 'Nedtrekk / Sittende Roing',
    muscleGroup: MuscleGroup.BACK,
    secondaryMuscleGroups: [MuscleGroup.ARMS],
    type: ExerciseType.WEIGHTED,
    description: 'Trekk stangen ned til øvre del av brystet. Hold albuene litt ut til siden. Slipp rolig opp igjen.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Nedtrekk'
  },
  {
    id: 'ex_pullup',
    name: 'Pull-ups',
    muscleGroup: MuscleGroup.BACK,
    secondaryMuscleGroups: [MuscleGroup.ARMS, MuscleGroup.CORE],
    type: ExerciseType.BODYWEIGHT,
    description: 'Heng i stangen med hendene litt bredere enn skulderbredde. Trekk deg opp til haken er over stangen. Senk deg kontrollert ned.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Pull-ups'
  },
  {
    id: 'ex_tbar_row',
    name: 'T-bar Row',
    muscleGroup: MuscleGroup.BACK,
    secondaryMuscleGroups: [MuscleGroup.ARMS, MuscleGroup.CORE],
    type: ExerciseType.WEIGHTED,
    description: 'Len deg fremover over T-bar stangen. Trekk vekten opp mot brystet med rett rygg. Klem skulderbladene sammen.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=T-bar+Row'
  },
  {
    id: 'ex_facepull',
    name: 'Face Pulls',
    muscleGroup: MuscleGroup.BACK,
    secondaryMuscleGroups: [MuscleGroup.SHOULDERS],
    type: ExerciseType.WEIGHTED,
    description: 'Fest et tau i kabelmaskinen i hodehøyde. Trekk tauet mot ansiktet mens du trekker albuene ut og bakover. Klem skulderbladene sammen.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Face+Pulls'
  },
  {
    id: 'ex_back_ext',
    name: 'Rygghev',
    muscleGroup: MuscleGroup.BACK,
    secondaryMuscleGroups: [MuscleGroup.LEGS],
    type: ExerciseType.BODYWEIGHT,
    description: 'Ligg på magen eller i et rygghev-apparat. Løft overkroppen opp ved å bruke korsryggen. Senk rolig ned igjen.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Rygghev'
  },

  // --- Kjerne ---
  {
    id: 'ex_plank',
    name: 'Planke',
    muscleGroup: MuscleGroup.CORE,
    secondaryMuscleGroups: [MuscleGroup.SHOULDERS],
    type: ExerciseType.DURATION,
    description: 'Støtt deg på albuene og tærne. Hold kroppen helt rett. Stram magen og setet. Ikke la korsryggen svaie.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Planke'
  },
  {
    id: 'ex_sideplank',
    name: 'Sideplanke',
    muscleGroup: MuscleGroup.CORE,
    secondaryMuscleGroups: [MuscleGroup.SHOULDERS],
    type: ExerciseType.DURATION,
    description: 'Ligg på siden og støtt deg på albuen. Løft hoften opp fra gulvet slik at kroppen danner en rett linje. Hold posisjonen.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Sideplanke'
  },
  {
    id: 'ex_deadbug',
    name: 'Deadbug',
    muscleGroup: MuscleGroup.CORE,
    type: ExerciseType.BODYWEIGHT,
    description: 'Ligg på ryggen med armer og bein opp mot taket. Senk motsatt arm og bein rolig ned mot gulvet mens du holder korsryggen presset ned i underlaget. Bytt side.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Deadbug'
  },
  {
    id: 'ex_russiantwist',
    name: 'Russian Twist',
    muscleGroup: MuscleGroup.CORE,
    type: ExerciseType.BODYWEIGHT,
    description: 'Sitt på rumpa med bøyde knær og føttene litt over gulvet. Len overkroppen litt bakover. Roter overkroppen fra side til side, gjerne med en vekt i hendene.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Russian+Twist'
  },
  {
    id: 'ex_hanging_knee',
    name: 'Hanging Knee Raises',
    muscleGroup: MuscleGroup.CORE,
    secondaryMuscleGroups: [MuscleGroup.ARMS],
    type: ExerciseType.BODYWEIGHT,
    description: 'Heng i en stang med strake armer. Løft knærne opp mot brystet ved å bruke magemusklene. Senk kontrollert ned.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Hanging+Knee'
  },

  // --- Armer ---
  {
    id: 'ex_bicep_curl',
    name: 'Bicep Curl',
    muscleGroup: MuscleGroup.ARMS,
    type: ExerciseType.WEIGHTED,
    description: 'Stå med manualene hengende langs siden. Bøy albuene for å løfte vektene opp mot skuldrene. Senk kontrollert ned.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Bicep+Curl'
  },
  {
    id: 'ex_hammer_curl',
    name: 'Hammer Curl',
    muscleGroup: MuscleGroup.ARMS,
    type: ExerciseType.WEIGHTED,
    description: 'Hold manualene med nøytral grep (håndflater mot hverandre). Bøy albuene for å løfte vektene. Senk kontrollert.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Hammer+Curl'
  },
  {
    id: 'ex_tricep_ext',
    name: 'Tricep Extensions',
    muscleGroup: MuscleGroup.ARMS,
    secondaryMuscleGroups: [MuscleGroup.SHOULDERS],
    type: ExerciseType.WEIGHTED,
    description: 'Hold en manual over hodet med begge hender. Senk vekten bak hodet ved å bøye i albuene. Strekk armene tilbake opp.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Tricep+Ext'
  },

  // --- Kondisjon (Lavterskel & Helse) ---
  {
    id: 'ex_walk_int',
    name: 'Gange m/ Intervaller',
    muscleGroup: MuscleGroup.CARDIO,
    secondaryMuscleGroups: [MuscleGroup.LEGS],
    type: ExerciseType.CARDIO,
    description: 'Veksle mellom rask gange (andpusten) og rolig gange. F.eks. 1 min raskt, 1 min rolig.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Gange'
  },
  {
    id: 'ex_walk_fast',
    name: 'Rask Gange',
    muscleGroup: MuscleGroup.CARDIO,
    secondaryMuscleGroups: [MuscleGroup.LEGS],
    type: ExerciseType.CARDIO,
    description: 'Gå i et tempo som gjør at du blir varm og litt andpusten, men fortsatt kan føre en samtale.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Rask+Gange'
  },
  {
    id: 'ex_stairs',
    name: 'Trappeintervaller',
    muscleGroup: MuscleGroup.CARDIO,
    secondaryMuscleGroups: [MuscleGroup.LEGS],
    type: ExerciseType.CARDIO,
    description: 'Løp eller gå raskt opp en trapp. Gå rolig ned igjen. Gjenta.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Trapper'
  },
  {
    id: 'ex_bike',
    name: 'Sykling',
    muscleGroup: MuscleGroup.CARDIO,
    secondaryMuscleGroups: [MuscleGroup.LEGS],
    type: ExerciseType.CARDIO,
    description: 'Sykling utendørs eller på ergometersykkel. Hold et jevnt tempo eller kjør intervaller.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Sykling'
  },
  {
    id: 'ex_elliptical',
    name: 'Ellippsemmaskin',
    muscleGroup: MuscleGroup.CARDIO,
    type: ExerciseType.CARDIO,
    description: 'Bruk armer og bein til å skape en jevn bevegelse. Hold ryggen rett.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Ellipse'
  },
  {
    id: 'ex_row_machine',
    name: 'Romaskin',
    muscleGroup: MuscleGroup.CARDIO,
    type: ExerciseType.CARDIO,
    description: 'Sitt på setet med føttene festet. Skyv fra med beina, len deg litt bakover og trekk håndtaket mot nedre del av brystet. Returner i motsatt rekkefølge.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Romaskin'
  },
  {
    id: 'ex_swim',
    name: 'Svømming',
    muscleGroup: MuscleGroup.CARDIO,
    type: ExerciseType.CARDIO,
    description: 'Svøm lengder i basseng. Varier gjerne mellom bryst, crawl og rygg.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Sv%C3%B8mming'
  },
  {
    id: 'ex_hike',
    name: 'Fjelltur / Skogstur',
    muscleGroup: MuscleGroup.CARDIO,
    type: ExerciseType.CARDIO,
    description: 'Gå tur i ulendt terreng. God trening for både kondisjon og balanse.',
    imageUrl: 'https://placehold.co/600x400/1e293b/f1f5f9?text=Tur'
  },

].sort((a, b) => a.name.localeCompare(b.name)); // Sorterer alfabetisk for bedre oversikt

// Hjelpefunksjon for å lage sett
const createSets = (count: number, reps: number = 10) => {
  return Array(count).fill(null).map(() => ({
    id: crypto.randomUUID(),
    weight: 0,
    reps: reps,
    completed: false
  }));
};

// Maler for øktene dine
export const createSessionA = (): WorkoutSession => ({
  id: crypto.randomUUID(),
  name: 'Økt A: Styrke & Intervall',
  date: getTodayDateString(),
  startTime: new Date().toISOString(),
  status: WorkoutStatus.ACTIVE,
  exercises: [
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_warmup', notes: '5 min rolig + 2 min raskere. Dynamisk tøyning.', sets: [{ id: crypto.randomUUID(), durationMinutes: 10, completed: false }] },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_squat', notes: '3 sett x 8-10 reps', sets: createSets(3, 10) },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_pushup', notes: 'Eller benkpress. 3 sett x 8-10 reps', sets: createSets(3, 10) },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_row', notes: '3 sett x 8-10 reps', sets: createSets(3, 10) },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_bridge', notes: '3 sett x 10-12 reps', sets: createSets(3, 12) },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_walk_int', notes: '1 min rask / 1 min rolig x 6-8 ganger', sets: [{ id: crypto.randomUUID(), durationMinutes: 15, completed: false }] },
  ]
});

export const createSessionB = (): WorkoutSession => ({
  id: crypto.randomUUID(),
  name: 'Økt B: Base & Trapper',
  date: getTodayDateString(),
  startTime: new Date().toISOString(),
  status: WorkoutStatus.ACTIVE,
  exercises: [
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_warmup', notes: '5 min rolig + 2 min raskere. Dynamisk tøyning.', sets: [{ id: crypto.randomUUID(), durationMinutes: 10, completed: false }] },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_deadlift', notes: 'Kettlebell eller stang. 3 sett x 6-8 reps', sets: createSets(3, 8) },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_press', notes: 'Sittende eller stående. 3 sett x 8-10 reps', sets: createSets(3, 10) },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_lat_row', notes: '3 sett x 8-10 reps', sets: createSets(3, 10) },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_plank', notes: '3 runder x 15-30 sek', sets: [{ id: crypto.randomUUID(), durationMinutes: 0.5, completed: false }, { id: crypto.randomUUID(), durationMinutes: 0.5, completed: false }, { id: crypto.randomUUID(), durationMinutes: 0.5, completed: false }] },
    { id: crypto.randomUUID(), exerciseDefinitionId: 'ex_stairs', notes: 'Gå opp/ned 1 etg. Pause 1 min. 5-8 ganger.', sets: [{ id: crypto.randomUUID(), durationMinutes: 10, completed: false }] },
  ]
});

export const createInitialHistory = (): WorkoutSession[] => {
  // Lager en "fullført" Økt A for et par dager siden for å vise historikk
  const date = new Date();
  date.setDate(date.getDate() - 2);

  const session = createSessionA();
  session.id = 'past_session_1';
  session.status = WorkoutStatus.COMPLETED; // Corrected syntax from previous version
  session.date = getDateString(date);
  session.startTime = date.toISOString();
  session.endTime = new Date(date.getTime() + 45 * 60000).toISOString(); // 45 min later
  session.exercises.forEach(ex => ex.sets.forEach(s => {
    s.completed = true;
    s.weight = 10; // Mock data
  }));

  return [session];
};

export const createEmptySession = (): WorkoutSession => ({
  id: crypto.randomUUID(),
  name: 'Egentrening',
  date: getTodayDateString(),
  startTime: new Date().toISOString(),
  exercises: [],
  status: WorkoutStatus.ACTIVE
});