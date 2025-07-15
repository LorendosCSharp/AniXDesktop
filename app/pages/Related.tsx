"use client";
import useSWRInfinite from "swr/infinite";
import { Spinner } from "#/components/Spinner/Spinner";
import { useState, useEffect } from "react";
import { useScrollPosition } from "#/hooks/useScrollPosition";
import { useUserStore } from "../store/auth";
import { ENDPOINTS } from "#/api/config";
import { useSWRfetcher } from "#/api/utils";
import { Card } from "flowbite-react";
import { Poster } from "#/components/ReleasePoster/Poster";
import { ReleaseChips } from "#/components/ReleasePoster/Chips";
import { PosterWithStuff } from "#/components/ReleasePoster/PosterWithStuff";
import Link from "next/link";

const profile_lists = {
  // 0: "Не смотрю",
  1: { name: "Смотрю", bg_color: "bg-green-500" },
  2: { name: "В планах", bg_color: "bg-purple-500" },
  3: { name: "Просмотрено", bg_color: "bg-blue-500" },
  4: { name: "Отложено", bg_color: "bg-yellow-500" },
  5: { name: "Брошено", bg_color: "bg-red-500" },
};
const YearSeason = ["_", "Зима", "Весна", "Лето", "Осень"];

export function RelatedPage(props: { id: number | string; title: string }) {
  const token = useUserStore((state) => state.token);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.content.length) return null;
    if (token) {
      return `${ENDPOINTS.release.related}/${props.id}/${pageIndex}?token=${token}&API-Version=v2`;
    }
    return `${ENDPOINTS.release.related}/${props.id}/${pageIndex}?API-Version=v2`;
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    useSWRfetcher,
    { initialSize: 1 }
  );

  const [content, setContent] = useState(null);
  useEffect(() => {
    if (data) {
      let allReleases = [];
      for (let i = 0; i < data.length; i++) {
        allReleases.push(...data[i].content);
      }
      setContent(allReleases);
    }
  }, [data]);

  const scrollPosition = useScrollPosition();
  useEffect(() => {
    if (scrollPosition >= 98 && scrollPosition <= 99) {
      setSize(size + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition]);

  return (
    <>
      <div className="flex items-center justify-between px-4 py-2 border-b-2 border-black dark:border-white">
        <h1 className="font-bold text-md sm:text-xl md:text-lg xl:text-xl">
          Франшиза {props.title}
        </h1>
      </div>
      {content && content.length > 0 ?
        <div className="flex flex-col gap-4 my-4">
          {content.map((release, index) => {
            const genres = [];
            const grade =
              release.grade ? Number(release.grade.toFixed(1)) : null;
            const profile_list_status = release.profile_list_status || null;
            let user_list = null;
            if (profile_list_status != null || profile_list_status != 0) {
              user_list = profile_lists[profile_list_status];
            }
            if (release.genres) {
              const genres_array = release.genres.split(",");
              genres_array.forEach((genre) => {
                genres.push(genre.trim());
              });
            }
            return (
              <Link href={`/release/${release.id}`} key={release.id}>
                <Card>
                  <div className="grid grid-cols-1 justify-center lg:grid-cols-[1fr_1fr_2fr] gap-4">
                    <div className="flex items-center justify-center">
                      <h1 className="inline-block text-6xl font-bold text-center text-transparent bg-gradient-to-r from-blue-600 via-purple-500 to-indigo-500 dark:from-blue-500 dark:via-purple-400 dark:to-indigo-300 bg-clip-text ">
                        {release.season ? YearSeason[release.season] : ""}
                        {release.season ?
                          <br />
                        : ""}
                        {release.year ? release.year : ""}
                      </h1>
                    </div>
                    <div className="flex items-center justify-center lg:hidden">
                      <div className="max-w-64">
                        <PosterWithStuff {...release} />
                      </div>
                    </div>
                    <div className="hidden lg:flex">
                      <Poster image={release.image} className="h-auto" />
                    </div>
                    <div className="flex-col hidden gap-2 lg:flex">
                      <ReleaseChips
                        {...release}
                        user_list={user_list}
                        grade={grade}
                      />
                      <div>
                        {genres.length > 0 &&
                          genres.map((genre: string, index: number) => {
                            return (
                              <span
                                key={`release_${props.id}_genre_${genre}_${index}`}
                                className="font-light dark:text-white md:text-sm lg:text-base xl:text-lg"
                              >
                                {index > 0 && ", "}
                                {genre}
                              </span>
                            );
                          })}
                      </div>
                      {release.title_ru && (
                        <p className="text-xl font-bold dark:text-white md:text-2xl">
                          {release.title_ru}
                        </p>
                      )}
                      {release.title_original && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 md:text-base">
                          {release.title_original}
                        </p>
                      )}
                      {release.description && (
                        <p className="mt-2 text-sm font-light dark:text-white lg:text-base xl:text-lg line-clamp-2">
                          {release.description}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      : isLoading ?
        <div className="flex flex-col items-center justify-center min-w-full min-h-screen">
          <Spinner />
        </div>
      : <div className="flex flex-col items-center justify-center min-w-full gap-4 mt-12 text-xl">
          <span className="w-24 h-24 iconify-color twemoji--broken-heart"></span>
          <p>В франшизе пока ничего нет...</p>
        </div>
      }
      {data &&
        data[data.length - 1].current_page <
          data[data.length - 1].total_page_count && (
          <button
            className="mx-auto w-[calc(100%-10rem)] border border-black rounded-lg p-2 mb-6 flex items-center justify-center gap-2 hover:bg-black hover:text-white transition"
            onClick={() => setSize(size + 1)}
          >
            <span className="w-10 h-10 iconify mdi--plus"></span>
            <span className="text-lg">Загрузить ещё</span>
          </button>
        )}
    </>
  );
}
