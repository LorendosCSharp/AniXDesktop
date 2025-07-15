"use client";
import { ReleaseCourusel } from "#/components/ReleaseCourusel/ReleaseCourusel";
import { Spinner } from "#/components/Spinner/Spinner";
import { useUserStore } from "#/store/auth";
import { useState, useEffect } from "react";
import { _FetchHomePageReleases } from "#/api/utils";

import { usePreferencesStore } from "#/store/preferences";
import { useRouter } from "next/navigation";

export function IndexPage() {
  const token = useUserStore((state) => state.token);
  const preferenceStore = usePreferencesStore();
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true);
  const [lastReleasesData, setLastReleasesData] = useState(null);
  const [ongoingReleasesData, setOngoingReleasesData] = useState(null);
  const [finishedReleasesData, setFinishedReleasesData] = useState(null);
  const [announceReleasesData, setAnnounceReleasesData] = useState(null);
  const [filmsReleasesData, setFilmsReleasesData] = useState(null);

  useEffect(() => {
    if (preferenceStore.params.skipToCategory.enabled) {
      router.push(`/home/${preferenceStore.params.skipToCategory.homeCategory}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function _loadReleases() {
      setIsLoading(true);
      setLastReleasesData(null);
      setOngoingReleasesData(null);
      setFinishedReleasesData(null);
      setAnnounceReleasesData(null);
      setFilmsReleasesData(null);

      const lastReleases = await _FetchHomePageReleases("last", token);
      const ongoingReleases = await _FetchHomePageReleases("ongoing", token);
      const finishedReleases = await _FetchHomePageReleases("finished", token);
      const announceReleases = await _FetchHomePageReleases("announce", token);
      const filmsReleases = await _FetchHomePageReleases("films", token);

      setLastReleasesData(lastReleases);
      setOngoingReleasesData(ongoingReleases);
      setFinishedReleasesData(finishedReleases);
      setAnnounceReleasesData(announceReleases);
      setFilmsReleasesData(filmsReleases);
      setIsLoading(false);
    }
    if (!preferenceStore.params.skipToCategory.enabled) {
      _loadReleases();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <>
      {lastReleasesData ? (
        <ReleaseCourusel
          sectionTitle="Последние релизы"
          showAllLink="/home/last"
          content={lastReleasesData.content}
        />
      ) : (
        <div className="flex items-center justify-center min-w-full min-h-screen">
          <Spinner />
        </div>
      )}
      {finishedReleasesData && (
        <ReleaseCourusel
          sectionTitle="Завершенные релизы"
          showAllLink="/home/finished"
          content={finishedReleasesData.content}
        />
      )}
      {ongoingReleasesData && (
        <ReleaseCourusel
          sectionTitle="Выходит"
          showAllLink="/home/ongoing"
          content={ongoingReleasesData.content}
        />
      )}
      {announceReleasesData && (
        <ReleaseCourusel
          sectionTitle="Анонсированные релизы"
          showAllLink="/home/announce"
          content={announceReleasesData.content}
        />
      )}
      {filmsReleasesData && (
        <ReleaseCourusel
          sectionTitle="Фильмы"
          showAllLink="/home/films"
          content={filmsReleasesData.content}
        />
      )}
      {!isLoading &&
        !lastReleasesData &&
        !finishedReleasesData &&
        !ongoingReleasesData &&
        !announceReleasesData && (
          <div className="flex items-center justify-center min-w-full min-h-screen">
            <h1 className="text-2xl">Ошибка загрузки контента...</h1>
          </div>
        )}
    </>
  );
}
