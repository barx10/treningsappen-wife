import { GoogleGenAI } from '@google/genai';
import OpenAI from 'openai';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('API handler started');

  try {
    const { profile, weekHistory, availableExercises } = req.body;
    
    console.log('Request data:', { 
      profileGoal: profile?.goal,
      historyCount: weekHistory?.length,
      exercisesCount: availableExercises?.length 
    });
    
    // Determine which AI provider to use
    const useOpenAI = process.env.OPENAI_API_KEY && process.env.AI_PROVIDER === 'openai';
    
    // Validate API key
    if (useOpenAI) {
      if (!process.env.OPENAI_API_KEY) {
        console.error('OPENAI_API_KEY is not set');
        return res.status(500).json({ error: 'API key not configured' });
      }
      console.log('Using OpenAI GPT-4o-mini...');
    } else {
      if (!process.env.GEMINI_API_KEY) {
        console.error('GEMINI_API_KEY is not set');
        return res.status(500).json({ error: 'API key not configured' });
      }
      console.log('Using Google Gemini...');
    }

    // Helper to parse dates consistently
    const parseDateString = (dateStr) => {
      if (dateStr.length === 10 && dateStr.includes('-')) {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
      }
      const date = new Date(dateStr);
      return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    const prompt = `Du er en personlig treningscoach. Lag et detaljert treningsopplegg basert på følgende:

PROFIL:
- Mål: ${profile.goal}
- Alder: ${profile.age || 'Ikke oppgitt'}
- Vekt: ${profile.weight || 'Ikke oppgitt'}kg
- Kjønn: ${profile.gender || 'Ikke oppgitt'}

DENNE UKENS TRENING:
${weekHistory.length > 0 ? weekHistory.map((s) => {
  const sessionDate = parseDateString(s.date);
  const sessionVolume = s.exercises.reduce((sum, e) => sum + (e.totalVolume || 0), 0);
  return `
📅 ${sessionDate.toLocaleDateString('nb-NO')} (Totalt volum: ${Math.round(sessionVolume)} kg):
${s.exercises.map((e) => {
  const setInfo = e.setDetails?.length > 0
    ? e.setDetails.map(set => `${set.weight}kg×${set.reps}`).join(', ')
    : 'Ingen data';
  return `  • ${e.name} (${e.muscleGroup}): ${e.setsCompleted || e.sets || 0} sett, maks ${e.maxWeight || 0}kg, ${e.totalReps || 0} reps, ${Math.round(e.totalVolume || 0)}kg volum [${setInfo}]`;
}).join('\n')}`;
}).join('\n') : '- Ingen økter denne uken'}

UKENS STATISTIKK:
${(() => {
  if (weekHistory.length === 0) return '- Ingen data';
  const totalSets = weekHistory.reduce((sum, s) => sum + s.exercises.reduce((eSum, e) => eSum + (e.setsCompleted || e.sets || 0), 0), 0);
  const totalVolume = weekHistory.reduce((sum, s) => sum + s.exercises.reduce((eSum, e) => eSum + (e.totalVolume || 0), 0), 0);
  const totalReps = weekHistory.reduce((sum, s) => sum + s.exercises.reduce((eSum, e) => eSum + (e.totalReps || 0), 0), 0);
  const muscleGroups = {};
  weekHistory.forEach(s => s.exercises.forEach(e => {
    muscleGroups[e.muscleGroup] = (muscleGroups[e.muscleGroup] || 0) + (e.totalVolume || 0);
  }));
  return `- Antall økter: ${weekHistory.length}
- Totalt sett: ${totalSets}
- Totalt reps: ${totalReps}
- Totalt volum: ${Math.round(totalVolume)} kg
- Volum per muskelgruppe: ${Object.entries(muscleGroups).map(([m, v]) => `${m}: ${Math.round(v)}kg`).join(', ')}`;
})()}

TILGJENGELIGE ØVELSER:
${availableExercises.map((e) => `- ${e.name} (${e.muscleGroup}, ${e.type}) [ID: ${e.id}]`).join('\n')}

VIKTIGE REGLER FOR TILPASNING TIL MÅL:

${profile.goal === 'strength' ? `
MÅL: STYRKE
- Fokus på tunge baseøvelser (knebøy, markløft, benkpress, roing)
- FÆRRE reps (3-6 reps) og HØYERE vekt
- Lengre hviletid (2-3 min)
- 3-5 øvelser totalt (ikke for mange)
- Prioriter store muskelgrupper
` : ''}

${profile.goal === 'muscle' ? `
MÅL: MUSKELVEKST
- Balanse mellom baseøvelser og isolasjon
- Moderate reps (8-12 reps)
- Moderat hviletid (60-90 sek)
- 5-7 øvelser
- Inkluder både sammensatte og isolasjonsøvelser
` : ''}

${profile.goal === 'endurance' ? `
MÅL: KONDISJON/UTHOLDENHET
- Høyere reps (12-20 reps)
- Kortere hviletid (30-60 sek)
- Inkluder mer cardio-baserte øvelser
- Flere øvelser i circuit-stil
- Lettere vekt, høyere volum
` : ''}

${profile.goal === 'general' ? `
MÅL: GENERELL HELSE
- Balansert mix av øvelser
- Moderate reps (8-12 reps)
- Moderat hviletid (60-90 sek)
- 5-6 øvelser
- Fokus på funksjonelle bevegelser
` : ''}

GENERELLE INSTRUKSJONER:
1. Analyser hva brukeren har trent denne uken
2. Identifiser muskelgrupper som trenger fokus (UNNGÅ muskelgrupper trent i går eller i går)
3. Velg øvelser fra listen over tilgjengelige øvelser (VIKTIG: Bruk BARE øvelser fra listen, og bruk korrekt ID)
4. Tilpass ALLE parametre (sett, reps, hviletid) til brukerens mål
5. VIKTIG: Ikke lag for hardcore opplegg - tilpass til brukerens nivå
6. Inkluder alltid oppvarming som første øvelse
7. Vær konservativ med antall sett - bedre å starte lavt enn for høyt

Returner et JSON-objekt med følgende struktur (BARE JSON, ingen annen tekst):
{
  "name": "Navn på økten (f.eks. 'Bryst og Triceps - Muskelvekst')",
  "exercises": [
    {
      "exerciseId": "id fra tilgjengelige øvelser",
      "sets": 3,
      "reps": "8-12",
      "restTime": 90,
      "notes": "Kort tips (optional)"
    }
  ],
  "totalDuration": 60,
  "focusAreas": ["Bryst", "Triceps"],
  "reasoning": "Kort forklaring på hvorfor dette opplegget passer nå (2-3 setninger)"
}`;

    let workout;

    if (useOpenAI) {
      console.log('Calling OpenAI API...');
      const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.7,
      });

      console.log('OpenAI API response received');
      workout = JSON.parse(completion.choices[0].message.content);
    } else {
      console.log('Calling Gemini API...');
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const result = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: { parts: [{ text: prompt }] },
        config: {
          responseMimeType: 'application/json'
        }
      });

      console.log('Gemini API response received');
      console.log('Raw result.text:', result.text);
      
      workout = JSON.parse(result.text);
      console.log('Parsed workout type:', Array.isArray(workout) ? 'array' : 'object');
      console.log('Parsed workout:', workout);
      
      // If Gemini returns an array, take the first item
      if (Array.isArray(workout)) {
        console.log('Converting array to object');
        workout = workout[0];
      }
    }
    
    console.log('Final workout:', workout);
    
    res.status(200).json(workout);
  } catch (error) {
    console.error('Generate workout error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    res.status(500).json({ 
      error: 'Failed to generate workout',
      details: errorMessage 
    });
  }
}
