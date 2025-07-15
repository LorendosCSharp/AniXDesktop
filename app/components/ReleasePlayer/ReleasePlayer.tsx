"use client";

import { Spinner } from "#/components/Spinner/Spinner";
import { useUserStore } from "#/store/auth";
import { useUserPlayerPreferencesStore } from "#/store/player";
import { Button, Card, Dropdown, DropdownItem } from "flowbite-react";
import { ENDPOINTS } from "#/api/config";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/mousewheel";
import "swiper/css/scrollbar";
import { Navigation, Mousewheel, Scrollbar } from "swiper/modules";
import { usePreferencesStore } from "#/store/preferences";

const DropdownTheme = {
  floating: {
    target: "w-full md:min-w-[256px] md:w-fit",
  },
};

async function _fetch(url: string) {
  const data = fetch(url)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Error fetching data");
      }
    })
    .catch((err) => console.log(err));
  return data;
}

export const getAnonEpisodesWatched = (
  Release: number,
  Source: number,
  Voiceover: number
) => {
  const anonEpisodesWatched =
    JSON.parse(localStorage.getItem("anonEpisodesWatched")) || {};

  if (!anonEpisodesWatched.hasOwnProperty(Release)) {
    anonEpisodesWatched[Release] = {};
  }
  if (!anonEpisodesWatched[Release].hasOwnProperty(Source)) {
    anonEpisodesWatched[Release][Source] = {};
  }
  if (!anonEpisodesWatched[Release][Source].hasOwnProperty(Voiceover)) {
    anonEpisodesWatched[Release][Source][Voiceover] = {};
  }

  return anonEpisodesWatched;
};

const getAnonCurrentEpisodeWatched = (
  Release: number,
  Source: number,
  Voiceover: number,
  Episode: number
) => {
  const anonEpisodesWatched =
    JSON.parse(localStorage.getItem("anonEpisodesWatched")) || {};

  if (!anonEpisodesWatched.hasOwnProperty(Release)) {
    return false;
  }
  if (!anonEpisodesWatched[Release].hasOwnProperty(Source)) {
    return false;
  }
  if (!anonEpisodesWatched[Release][Source].hasOwnProperty(Voiceover)) {
    return false;
  }
  if (
    !anonEpisodesWatched[Release][Source][Voiceover].hasOwnProperty(Episode)
  ) {
    return false;
  }

  return anonEpisodesWatched[Release][Source][Voiceover][Episode];
};

export const saveAnonEpisodeWatched = (
  Release: number,
  Source: number,
  Voiceover: number,
  Episode: number
) => {
  const anonEpisodesWatched = getAnonEpisodesWatched(
    Release,
    Source,
    Voiceover
  );
  localStorage.setItem(
    "anonEpisodesWatched",
    JSON.stringify({
      ...anonEpisodesWatched,
      [Release]: {
        ...anonEpisodesWatched[Release],
        [Source]: {
          ...anonEpisodesWatched[Release][Source],
          [Voiceover]: {
            ...anonEpisodesWatched[Release][Source][Voiceover],
            [Episode]: true,
          },
        },
      },
    })
  );
};

export const ReleasePlayer = (props: { id: number }) => {
  const userStore = useUserStore();
  const preferredVoiceoverStore = useUserPlayerPreferencesStore();
  const storedPreferredVoiceover =
    preferredVoiceoverStore.getPreferredVoiceover(props.id);
  const storedPreferredPlayer = preferredVoiceoverStore.getPreferredPlayer(
    props.id
  );
  const [voiceoverInfo, setVoiceoverInfo] = useState(null);
  const [selectedVoiceover, setSelectedVoiceover] = useState(null);
  const [sourcesInfo, setSourcesInfo] = useState(null);
  const [selectedSource, setSelectedSource] = useState(null);
  const [episodeInfo, setEpisodeInfo] = useState(null);
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const [error, setError] = useState(null);
  const setSelectedVoiceoverAndSaveAsPreferred = (voiceover: any) => {
    setSelectedVoiceover(voiceover);
    preferredVoiceoverStore.setPreferredVoiceover(props.id, voiceover.name);
  };
  const setSelectedPlayerAndSaveAsPreferred = (player: any) => {
    setSelectedSource(player);
    preferredVoiceoverStore.setPreferredPlayer(props.id, player.name);
  };
  const preferenceStore = usePreferencesStore();

  function _setError(error: string) {
    setVoiceoverInfo(null);
    setSelectedVoiceover(null);
    setSourcesInfo(null);
    setSelectedSource(null);
    setEpisodeInfo(null);
    setSelectedEpisode(null);
    setError(error);
  }

  async function _fetchInfo(
    url: string,
    type: "voiceover" | "sources" | "episodes"
  ) {
    let data: any = {};
    data = await fetch(url)
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error("Error fetching data");
        }
      })
      .catch((err) => {
        _setError("Ошибка получение ответа от сервера");
        return;
      });

    if (!data || (data && Object.keys(data).length == 0)) {
      _setError("Ошибка получение данных с сервера");
      return;
    }

    if (type == "voiceover") {
      setVoiceoverInfo(data.types);
      const preferredVoiceover =
        data.types.find(
          (voiceover: any) => voiceover.name === storedPreferredVoiceover
        ) || data.types[0];
      setSelectedVoiceover(preferredVoiceover);
    } else if (type == "sources") {
      setSourcesInfo(data.sources);
      const preferredSource =
        data.sources.find(
          (source: any) => source.name === storedPreferredPlayer
        ) || data.sources[0];
      setSelectedSource(preferredSource);
    } else if (type == "episodes") {
      if (data.episodes.length === 0) {
        const remSources = sourcesInfo.filter(
          (source) => source.id !== selectedSource.id
        );
        setSourcesInfo(remSources);
        setSelectedSource(remSources[0]);
        return;
      } else {
        setEpisodeInfo(data.episodes);
        setSelectedEpisode(data.episodes[0]);

        const WatchedEpisodes = getAnonEpisodesWatched(
          props.id,
          selectedSource.id,
          selectedVoiceover.id
        );
        if (
          Object.keys(
            WatchedEpisodes[props.id][selectedSource.id][selectedVoiceover.id]
          ).length != 0
        ) {
          const watchedEpisodes =
            WatchedEpisodes[props.id][selectedSource.id][selectedVoiceover.id];
          let lastWatchedEpisode = Number(Object.keys(watchedEpisodes).pop());
          if (
            !["Sibnet", "Sibnet (не работает)"].includes(selectedSource.name)
          ) {
            lastWatchedEpisode = Number(lastWatchedEpisode) - 1;
          }
          setSelectedEpisode(data.episodes[lastWatchedEpisode]);
        }
      }
    } else {
      _setError("Неизвестный тип запроса");
    }
  }

  useEffect(() => {
    _fetchInfo(`${ENDPOINTS.release.episode}/${props.id}`, "voiceover");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id]);

  useEffect(() => {
    if (selectedVoiceover) {
      _fetchInfo(
        `${ENDPOINTS.release.episode}/${props.id}/${selectedVoiceover.id}`,
        "sources"
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id, selectedVoiceover]);

  useEffect(() => {
    if (selectedSource) {
      let url = `${ENDPOINTS.release.episode}/${props.id}/${selectedVoiceover.id}/${selectedSource.id}`;
      if (userStore.token) {
        url = `${ENDPOINTS.release.episode}/${props.id}/${selectedVoiceover.id}/${selectedSource.id}?token=${userStore.token}`;
      }
      _fetchInfo(url, "episodes");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.id, selectedSource, userStore.token]);

  function _addToHistory(episode: any) {
    if (props.id && selectedSource && selectedVoiceover && episode) {
      const anonEpisodesWatched = getAnonEpisodesWatched(
        props.id,
        selectedSource.id,
        selectedVoiceover.id
      );
      if (
        preferenceStore.flags.saveWatchHistory &&
        !episode.is_watched &&
        !Object.keys(
          anonEpisodesWatched[props.id][selectedSource.id][selectedVoiceover.id]
        ).includes(episode.position.toString())
      ) {
        episode.is_watched = true;
        saveAnonEpisodeWatched(
          props.id,
          selectedSource.id,
          selectedVoiceover.id,
          episode.position
        );
        if (userStore.token) {
          fetch(
            `${ENDPOINTS.statistic.addHistory}/${props.id}/${selectedSource.id}/${episode.position}?token=${userStore.token}`
          );
          fetch(
            `${ENDPOINTS.statistic.markWatched}/${props.id}/${selectedSource.id}/${episode.position}?token=${userStore.token}`
          );
        }
      }
    }
  }

  return (
    <Card>
      {!voiceoverInfo || !sourcesInfo || !episodeInfo ?
        <div className="flex items-center justify-center w-full aspect-video">
          {!error ?
            <Spinner />
          : <p>{error}</p>}
        </div>
      : <>
          <div className="flex flex-wrap gap-2">
            <Dropdown
              label={`Озвучка: ${selectedVoiceover.name}`}
              color="blue"
              theme={DropdownTheme}
            >
              {voiceoverInfo.map((voiceover: any) => (
                <DropdownItem
                  key={`voiceover_${voiceover.id}`}
                  onClick={() =>
                    setSelectedVoiceoverAndSaveAsPreferred(voiceover)
                  }
                >
                  {voiceover.name}
                </DropdownItem>
              ))}
            </Dropdown>
            <Dropdown
              label={`Плеер: ${selectedSource.name}`}
              color="blue"
              theme={DropdownTheme}
            >
              {sourcesInfo.map((source: any) => (
                <DropdownItem
                  key={`source_${source.id}`}
                  onClick={() => setSelectedPlayerAndSaveAsPreferred(source)}
                >
                  {source.name}
                </DropdownItem>
              ))}
            </Dropdown>
          </div>
          <div className="aspect-video">
            {selectedEpisode ?
              <iframe
                allowFullScreen={true}
                src={selectedEpisode.url}
                className="w-full h-full rounded-md"
              ></iframe>
            : <p>Ошибка загрузки плеера</p>}
          </div>
          <div>
            <Swiper
              modules={[Navigation, Mousewheel, Scrollbar]}
              spaceBetween={8}
              slidesPerView={"auto"}
              direction={"horizontal"}
              mousewheel={{
                enabled: true,
                sensitivity: 4,
              }}
              scrollbar={{
                enabled: true,
                draggable: true,
              }}
              allowTouchMove={true}
              style={
                {
                  "--swiper-scrollbar-bottom": "0",
                } as React.CSSProperties
              }
            >
              {episodeInfo.map((episode: any) => (
                <SwiperSlide
                  key={`episode_${episode.position}`}
                  style={{ maxWidth: "fit-content" }}
                  className="pb-2"
                >
                  <Button
                    color={
                      selectedEpisode.position === episode.position ?
                        "blue"
                      : "light"
                    }
                    theme={{ base: "w-full disabled:opacity-100" }}
                    onClick={() => {
                      setSelectedEpisode(episode);
                      _addToHistory(episode);
                    }}
                    disabled={selectedEpisode.position === episode.position}
                  >
                    {episode.name ?
                      episode.name
                    : `${
                        (
                          !["Sibnet", "Sibnet (не работает)"].includes(
                            selectedSource.name
                          )
                        ) ?
                          episode.position
                        : episode.position + 1
                      } серия`
                    }
                    {(
                      episode.is_watched ||
                      getAnonCurrentEpisodeWatched(
                        props.id,
                        selectedSource.id,
                        selectedVoiceover.id,
                        episode.position
                      )
                    ) ?
                      <span className="w-5 h-5 ml-2 iconify material-symbols--check-circle"></span>
                    : <span className="w-5 h-5 ml-2 opacity-10 iconify material-symbols--check-circle"></span>
                    }
                  </Button>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </>
      }
    </Card>
  );
};
