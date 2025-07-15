"use client";

import { ENDPOINTS } from "#/api/config";
import { useEffect } from "react";
import { _fetchAPI } from "./PlayerParsing";
import { useUserPlayerPreferencesStore } from "#/store/player";
import { numberDeclension } from "#/api/utils";
import { Voiceover } from "./VoiceoverSelectorMenu";

export interface Source {
  id: number;
  name: string;
  episodes_count: number;
}

interface SourceSelectorMenuProps {
  release_id: number;
  setSource: (state) => void;
  voiceover: Voiceover;
  source: Source;
  sourceList: Source[];
  setPlayerError: (state) => void;
}

export const SourceSelectorMenu = ({
  release_id,
  setSource,
  voiceover,
  source,
  sourceList,
  setPlayerError,
}: SourceSelectorMenuProps) => {
  const playerPreferenceStore = useUserPlayerPreferencesStore();
  const preferredSource = playerPreferenceStore.getPreferredPlayer(release_id);

  useEffect(() => {
    const __getInfo = async () => {
      let url = `${ENDPOINTS.release.episode}/${release_id}/${voiceover.id}`;
      const src = await _fetchAPI(
        url,
        "Не удалось получить информацию о источниках",
        setPlayerError
      );
      if (src) {
        const selectedSrc =
          src.sources.find(
            (source: Source) => source.name === preferredSource
          ) || src.sources[0];
        if (selectedSrc.episodes_count == 0) {
          const remSources = src.sources.filter(
            (source: any) => source.id !== selectedSrc.id
          );
          setSource({
            selected: remSources[0],
            available: remSources,
          });
          return;
        }
        setSource({
          selected: selectedSrc,
          available: src.sources,
        });
      }
    };
    if (voiceover) {
      __getInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voiceover]);

  if (!voiceover || !source || !sourceList || sourceList.length <= 1) return <></>

  return (
    <div className="flex flex-col items-start justify-start gap-4">
      <p className="text-[20px] px-2 pt-2 pb-1 font-bold">Источник</p>
      <div className="max-h-full flex flex-col gap-4 items-start justify-start overflow-x-hidden overflow-y-auto px-2 pb-2 scrollbar-thin scrollbar-thumb-[rgb(60_60_60_/_.8)] scrollbar-track-[rgb(30_30_30_/_.8)]">
        {sourceList && sourceList.length > 0 ?
          sourceList.map((src: Source) => {
            return (
              <button
                key={`release-${release_id}-voiceover-${voiceover.id}-source-${src.id}`}
                className={`h-fit ${source.id == src.id ? "text-white" : "text-gray-300 hover:text-gray-100"} transition-colors`}
                onClick={() => {
                  setSource({
                    selected: src,
                    available: sourceList,
                  });
                  playerPreferenceStore.setPreferredPlayer(
                    release_id,
                    src.name
                  );
                }}
              >
                <div className="flex flex-col w-full gap-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[16px] leading-none">{src.name}</span>
                  </div>
                  <div className="flex gap-2">
                    <span>
                      {src.episodes_count || 0}{" "}
                      {numberDeclension(
                        src.episodes_count || 0,
                        "серия",
                        "серии",
                        "серий"
                      )}
                    </span>
                  </div>
                </div>
              </button>
            );
          })
        : ""}
      </div>
    </div>
  );
};
