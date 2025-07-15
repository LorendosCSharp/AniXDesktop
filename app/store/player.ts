"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface userPlayerPreferencesState {
  voiceover: Record<number, string>;
  player: Record<number, string>;
  getPreferredVoiceover: (id: number) => string | undefined;
  setPreferredVoiceover: (id: number, voiceover: string) => void;
  getPreferredPlayer: (id: number) => string | undefined;
  setPreferredPlayer: (id: number, player: string) => void;
}

export const useUserPlayerPreferencesStore =
  create<userPlayerPreferencesState>()(
    persist(
      (set, get) => ({
        voiceover: {},
        player: {},
        getPreferredVoiceover: (id: number) => get().voiceover[id],
        setPreferredVoiceover: (id: number, voiceover: string) => {
          set({
            voiceover: { ...get().voiceover, [id]: voiceover },
            player: get().player,
          });
        },
        getPreferredPlayer: (id: number) => get().player[id],
        setPreferredPlayer: (id: number, player: string) => {
          set({
            player: { ...get().player, [id]: player },
            voiceover: get().voiceover,
          });
        },
      }),
      {
        name: "player-preferences",
      }
    )
  );
