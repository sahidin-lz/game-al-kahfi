import { Scenario } from './data/scenarioData';

export interface Equipment {
  alasKaki: string | null;
  pakaian: string | null;
}

export interface GameState {
  energi: number;
  maxEnergi: number;
  uang_qris: number;
  hifdz: number;
  faham: number;
  ukhuwah: number;
  ketegangan_sosial: number;
  locationContext: string;
  status_kota: string;
  equipment: Equipment;
  currentScenarioIndex: number;
  quests: Scenario[];
}

export interface EvaluationResult {
  indikasi_curang?: boolean;
  evaluasi: {
    saran_guru: string;
    koreksi_tahfidz: string;
    analisis_sosiologi?: string;
    analisis_tadabur?: string;
    referensi_quran: {
      surat_ayat: string;
      teks_arab: string;
      terjemahan: string;
    };
    skor_sosiologi: number;
    skor_akhlak?: number;
    skor_tahfidz?: number;
    skor_tadabur?: number;
  };
  narasi_rpg: {
    cerita_konsekuensi: string;
  };
  perubahan_status: {
    energi: number;
    uang_qris: number;
    hifdz: number;
    faham: number;
    ukhuwah: number;
    ketegangan_sosial_kota: number;
  };
  status_kota: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  role: 'ADMIN' | 'STUDENT';
  lastActiveAt: any;
}

export interface StoryLog {
  id: string;
  type: 'narrative' | 'player_action' | 'evaluation';
  content: string;
  inputType?: 'teks_esai' | 'suara_orasi';
  evaluation?: EvaluationResult;
}
