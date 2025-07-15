"use client";

import { Card } from "flowbite-react";
import { ReleaseLinkList } from "#/components/ReleaseLink/ReleaseLinkList";
import { useUserStore } from "#/store/auth";
import { ENDPOINTS } from "#/api/config";
import { BookmarksList, useSWRfetcher } from "#/api/utils";
import useSWR from "swr";
import { useEffect, useState } from "react";

export const ContinueWatching = () => {
  const userStore = useUserStore();

  function useFetchReleases(listName: string) {
    let url: string;
    if (userStore.token) {
      url = `${ENDPOINTS.user.bookmark}/all/${BookmarksList[listName]}/0?sort=1&token=${userStore.token}`;
    }
    const { data, isLoading, error } = useSWR(url, useSWRfetcher);
    return [data, isLoading, error];
  }

  const [watchingData, watchingLoading, watchingError] =
    useFetchReleases("watching");
  const [plannedData, plannedLoading, plannedError] =
    useFetchReleases("planned");
  const [delayedData, delayedLoading, delayedError] =
    useFetchReleases("delayed");

  const [releaseData, setReleaseData] = useState<any[]>([]);

  const firstN = (arr, n = 1) => arr.slice(0, n);
  function _randomize(array: any[], limit: number) {
    const toRand = array.slice();
    let currentIndex = toRand.length;
    while (currentIndex != 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [toRand[currentIndex], toRand[randomIndex]] = [
        toRand[randomIndex],
        toRand[currentIndex],
      ];
    }
    return firstN(toRand, limit);
  }

  useEffect(() => {
    if (!watchingLoading && !plannedLoading && !delayedLoading) {
      const data = [
        ...(watchingData.content || []),
        ...(plannedData.content || []),
        ...(delayedData.content || []),
      ];
      const randomizedData = _randomize(data, 3);
      setReleaseData(randomizedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchingLoading, plannedLoading, delayedLoading]);

  if (
    !userStore.isAuth ||
    watchingLoading ||
    plannedLoading ||
    delayedLoading ||
    releaseData.length == 0
  )
    return <></>;

  return (
    <Card>
      <div className="flex justify-between py-2 border-b-2 border-black dark:border-white">
        <h1>Продолжить просмотр</h1>
      </div>
      <div className="flex flex-col gap-4 mt-2">
        {releaseData.map((release: any) => {
          return (
            <ReleaseLinkList
              key={release.id}
              {...release}
              settings={{ showDescription: false }}
            />
          );
        })}
      </div>
    </Card>
  );
};
