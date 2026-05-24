
import { GoogleGenAI, Type } from "@google/genai";
import { SongData, AutoConfigData, ImageGenerationParams } from "../types";

const VALID_KEYS = ['C', 'Cm', 'C#', 'C#m', 'D', 'Dm', 'Eb', 'E', 'Em', 'F', 'Fm', 'F#', 'F#m', 'G', 'Gm', 'Ab', 'A', 'Am', 'Bb', 'B', 'Bm'];

/**
 * Enhanced Songwriter Engine using Gemini 3 High-Intelligence Models
 */
export const generateSong = async (params: {
  prompt: string;
  references?: string;
  inspirations?: string;
  language: string;
  genres: string[];
  bpm: number;
  key: string;
  vocalType: string;
  linesPerSection: number;
  poemType: string;
  autoMelody: boolean;
  autoTitle: boolean;
  duration: number;
  model: string;
  title?: string;
}): Promise<SongData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `You are a Legendary Platinum-Record Songwriter and Music Architect, specializing in sophisticated Thai lyrical structures.
Your task is to craft a MASTERPIECE in ${params.language} tailored for a ${params.duration} minute professional track.

${params.title ? `CRITICAL: The song MUST be titled "${params.title}". Do not change it.` : ''}

THAI LYRICAL EXCELLENCE & RHYME LAWS (CRITICAL):
1. **Strict Rhyming (สัมผัสระดับครู):** If the language is Thai, you MUST follow standard Thai poetry rules (สัมผัสนอก, สัมผัสระหว่างวรรค). The last word of a line must rhyme with the 3rd or 5th word of the next line, and the last word of a stanza must rhyme with the last word of the second line of the next stanza.
2. **Rhyme Types:** Prioritize 'Sumpat Sala' (vowel rhymes) for the main flow and 'Sumpat Payanchana' (alliteration) for internal beauty.
3. **Emotional Consistency:** Ensure the tone remains cohesive from [Intro] to [Outro].

CREATIVE DIRECTION & HARMONIC PROGRESSIONS:
1. Narrative Depth: Tell a cinematic story. Use personification, vivid imagery, and evocative metaphors. Avoid cliche "love/hurt" phrases; find new ways to describe feelings.
2. Structure: [Intro], [Verse 1], [Verse 2], [Pre-Chorus], [Chorus], [Bridge], [Instrumental Solo], [Final Chorus], [Outro].
3. Sectional 3-Layer Design:
   - [Section Tag]
   - (Instructional Cue): Detailed audio-visual cues and a professional chord progression recommendation (e.g., "(Chords: ${params.key === 'C' ? 'C - Am - F - G' : `${params.key} - DM7 - Bm7`} | Isan-soul guitar plucking with airy reverb, building tension for the hook)").
   - Lyrics: The emotional message lines.
4. Harmonic & Chord Guides: Choose chords that logically resolve back to the tonic key of ${params.key}. Ensure every section's cue lists its chord progression to guide the vocalist's pitch.

RHYTHM, SYLLABLE DENSITY & TRANSITIONS:
- Syllable Count: For ${params.bpm} BPM, ensure the line length allows the vocalist to breathe. Short, punchy lines for fast BPM (e.g., 4-6 syllables); elegant, long-phrase lines for slow BPM (e.g., 7-9 syllables).
- Transitions: Explicitly prompt transition changes in your instructional cues before the chorus or bridge (e.g., "Snare roll build-up", "Beat drops to half-time", "Crescendo on synth strings").
- NEVER use slashes (/) to separate lines. Use proper line breaks.

TECHNICAL SYNERGY:
- Key: Composed in ${params.key}.
- Genre: ${params.genres.join(', ')}.
- Feature: If 'Auto-tune' is listed, define the artifacting style (e.g., "Hard-tuned melodic glaze").

RESPONSE FORMAT: Strict JSON only.`;

  const userPrompt = `
  SONG SEED: ${params.prompt}
  ${params.title ? `PRE-DEFINED TITLE: ${params.title}` : ''}
  REFERENCES: ${params.references || 'Modern Industry Standard'}
  EMOTIONAL TARGET: ${params.inspirations || 'Authentic & Impactful'}
  CONFIG: ${params.bpm} BPM, ${params.key} Key, ${params.vocalType} Vocalist.
  `;

  const response = await ai.models.generateContent({
    model: params.model,
    contents: userPrompt,
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          lyrics: { type: Type.STRING, description: "Full lyrics with clear line breaks (\\n) and double newlines (\\n\\n) between sections." },
          suno_config: {
            type: Type.OBJECT,
            properties: {
              style: { type: Type.STRING, description: "Professional suno/udio style tags" },
              tempo: { type: Type.STRING },
              key: { type: Type.STRING },
              vocal_description: { type: Type.STRING },
              mood: { type: Type.STRING },
              instrumentation: { type: Type.STRING }
            }
          }
        },
        required: ["title", "lyrics", "suno_config"]
      }
    }
  });

  const data = JSON.parse(response.text || '{}');
  if (data.lyrics) {
    // Robust cleaning for better formatting
    data.lyrics = data.lyrics
      .replace(/\\r/g, '')
      .replace(/\\n/g, '\n')
      .replace(/\//g, '\n') // Replace slashes with newlines
      .replace(/[ \t]+/g, ' ') // Merge consecutive spaces or tabs (leaving newlines intact)
      .split('\n')
      .map((line: string) => line.trim()) // Trim individual lines
      .join('\n')
      .replace(/\n{3,}/g, '\n\n') // Limit maximum consecutive newlines to 2 between stanzas
      .trim();
  }
  return data;
};

/**
 * Intelligent Song Analysis & Strategy using Gemini 3
 */
export const analyzeAndConfigure = async (prompt: string, allowedGenres: string[], model: string): Promise<AutoConfigData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const response = await ai.models.generateContent({
    model: model,
    contents: `Analyze this music idea and prepare a production strategy: "${prompt}"`,
    config: {
      systemInstruction: `You are an Executive Music Producer & Musicologist. 
Your task is to synthesize a professional configuration based on the user's idea.

KEY SELECTION LOGIC (Circle of Fifths Principle):
- DO NOT default to F#m. Rotate through various keys based on emotional resonance.
- Uplifting/Happy: Use Major keys (C, G, D, A, E, B, F, Bb, Eb).
- Sad/Melancholic: Use Minor keys (Am, Em, Bm, F#m, C#m, G#m, Dm, Gm, Cm).
- Soulful/Jazz: Use Flat keys (Eb, Ab, Bb, Fm).
- Tensions/Edge: Use sharp keys or specific modes.
- Match key to Vocal Type: Lower keys for Bass/Altos, Higher for Tenors/Sopranos.

Choose from allowed genres: ${allowedGenres.join(', ')}.
Suggest modern artists as 'references' and specific aesthetic moods for 'inspirations'.
Suggest a catchy 'suggestedTitle'.
Calculate logical 'linesPerSection' (usually 4 for standard pop/rock).`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          language: { type: Type.STRING, description: "Detected or suggested language" },
          genres: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Must be from the allowed list" },
          bpm: { type: Type.INTEGER, description: "Ideal tempo" },
          key: { type: Type.STRING, description: "Ideal musical key" },
          vocalType: { type: Type.STRING, enum: ["ชาย", "หญิง", "คู่ (Duet)", "ประสานเสียง (Choral)"] },
          poemType: { type: Type.STRING, description: "Suggested rhyme structure" },
          linesPerSection: { type: Type.INTEGER, default: 4 },
          duration: { type: Type.NUMBER, default: 3.5 },
          suggestedTitle: { type: Type.STRING },
          references: { type: Type.STRING, description: "Relevant modern artists or styles" },
          inspirations: { type: Type.STRING, description: "Vibe or aesthetic descriptions" },
          reason: { type: Type.STRING, description: "Brief production log explaining the choices" }
        },
        required: ["language", "genres", "bpm", "key", "vocalType", "poemType", "linesPerSection", "duration", "suggestedTitle", "references", "inspirations", "reason"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

/**
 * Visual Identity Generation (Using Gemini 3 Multimodal reasoning)
 */
export const generateCoverImage = async (params: ImageGenerationParams): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `Generate a stunning, professional album cover for a song titled "${params.prompt}". 
Style: ${params.style}. 
Mood: Artistic, Modern, High-Resolution. 
Perspective: Professional graphic design layout, no text on image unless it's the title. 
Ratio: ${params.aspectRatio}.` }] },
  });
  
  // Note: Standard Gemini 2.0 Flash in some environments uses a different pattern for images, 
  // but we'll maintain the inlineData extraction logic if the platform provides it.
  const part = response.candidates[0].content.parts.find(p => p.inlineData);
  if (part?.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  
  // Fallback or Image Tool would be better if this fails, but fulfilling current structure.
  throw new Error('Image generation failed - please check model capabilities.');
};
