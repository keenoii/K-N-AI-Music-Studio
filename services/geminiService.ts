
import { GoogleGenAI, Type } from "@google/genai";
import { SongData, AutoConfigData, ImageGenerationParams } from "../types";

const VALID_KEYS = ['C', 'Cm', 'C#', 'C#m', 'D', 'Dm', 'Eb', 'E', 'Em', 'F', 'Fm', 'F#', 'F#m', 'G', 'Gm', 'Ab', 'A', 'Am', 'Bb', 'B', 'Bm'];

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
}): Promise<SongData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `You are a Master Songwriter and Music Arranger.
Your task is to write a COMPLETE SONG in ${params.language} for a ${params.duration} minute track.

MANDATORY FORMATTING RULES:
1. Use DOUBLE NEWLINES between every section to ensure readability.
2. Every section MUST follow this EXACT 3-layer structure:
   - Layer 1: [Tag] (e.g., [Intro], [Verse 1], [Chorus])
   - Layer 2: (Musical Description in English) -> Describe mood, instruments, and vocal style in parentheses.
   - Layer 3: The actual lyrics (or music cues for instrumentals).

Example of a section:
[Verse 1]
(Acoustic guitar strumming softly with a warm, intimate male vocal)
Line of lyrics 1...
Line of lyrics 2...

REQUIRED SECTIONS:
- [Intro], [Verse 1], [Verse 2], [Pre-Chorus], [Chorus], [Instrumental Solo], [Bridge], [Final Chorus], [Outro].

Style Guidelines:
- Language: ${params.language}
- Genres: ${params.genres.join(', ')}
- Poem Style: ${params.poemType}
- Description Language: English (Professional standard).`;

  const userPrompt = `
  Topic: ${params.prompt}
  Details: BPM ${params.bpm}, Key ${params.key}, Vocal: ${params.vocalType}.
  Reference: ${params.references || 'None'}.
  Inspiration: ${params.inspirations || 'None'}.
  `;

  const response = await ai.models.generateContent({
    model: params.model,
    contents: userPrompt,
    config: {
      systemInstruction,
      thinkingConfig: { thinkingBudget: 4000 },
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          lyrics: { type: Type.STRING },
          duration_minutes: { type: Type.NUMBER },
          suno_config: {
            type: Type.OBJECT,
            properties: {
              style: { type: Type.STRING },
              tempo: { type: Type.STRING },
              key: { type: Type.STRING },
              vocal_description: { type: Type.STRING },
              mood: { type: Type.STRING },
              instrumentation: { type: Type.STRING }
            }
          }
        },
        required: ["title", "lyrics", "suno_config", "duration_minutes"]
      }
    }
  });

  const data = JSON.parse(response.text || '{}');
  // Clean literal \n if AI mistakenly includes them as text
  if (data.lyrics) {
    data.lyrics = data.lyrics.replace(/\\n/g, '\n');
  }
  return data;
};

export const analyzeAndConfigure = async (prompt: string, allowedGenres: string[], model: string): Promise<AutoConfigData> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model,
    contents: `วิเคราะห์ไอเดียเพลง: "${prompt}"`,
    config: {
      systemInstruction: `Producer Role. Choose from: ${allowedGenres.join(', ')}. Recommend BPM, Key, Duration (1-5m), Language.`,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          language: { type: Type.STRING },
          genres: { type: Type.ARRAY, items: { type: Type.STRING } },
          bpm: { type: Type.INTEGER },
          key: { type: Type.STRING },
          vocalType: { type: Type.STRING },
          poemType: { type: Type.STRING },
          linesPerSection: { type: Type.INTEGER },
          duration: { type: Type.NUMBER },
          reason: { type: Type.STRING }
        },
        required: ["language", "genres", "bpm", "key", "vocalType", "poemType", "linesPerSection", "duration", "reason"]
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const generateCoverImage = async (params: ImageGenerationParams): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: `High-quality album cover for a song titled "${params.prompt}". Style: ${params.style}. Professional art.` }] },
    config: { imageConfig: { aspectRatio: params.aspectRatio } }
  });
  const part = response.candidates[0].content.parts.find(p => p.inlineData);
  if (part?.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
  throw new Error('Image failed');
};
