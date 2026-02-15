
export interface SunoConfig {
  style: string;
  tempo: string;
  key: string;
  vocal_description: string;
  mood: string;
  instrumentation: string;
  melody?: any;
}

export interface SongData {
  title: string;
  lyrics: string;
  suno_config: SunoConfig;
  duration_minutes: number;
  melody_suggestion?: {
    sections: Array<{
      name: string;
      pattern: string;
      chords: string;
    }>;
  };
}

export interface AutoConfigData {
  language: string;
  genres: string[];
  bpm: number;
  key: string;
  vocalType: string;
  poemType: string;
  linesPerSection: number;
  duration: number;
  reason: string;
}

export interface ImageGenerationParams {
  prompt: string;
  aspectRatio: "1:1" | "16:9" | "9:16" | "4:3" | "3:4";
  style: string;
}
