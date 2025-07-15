"use client";
import useSWRInfinite from "swr/infinite";
import { CollectionsSection } from "#/components/CollectionsSection/CollectionsSection";
import { Spinner } from "#/components/Spinner/Spinner";
import { useState, useEffect } from "react";
import { useScrollPosition } from "#/hooks/useScrollPosition";
import { useUserStore } from "../store/auth";
import { Button } from "flowbite-react";
import { ENDPOINTS } from "#/api/config";
import { useRouter } from "next/navigation";
import { useSWRfetcher } from "#/api/utils";

export function CollectionsFullPage(props: {
  type: "favorites" | "profile" | "release";
  title: string;
  profile_id?: number;
  release_id?: number;
}) {
  const userStore = useUserStore();
  const router = useRouter();

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.content.length) return null;

    let url: string;

    if (props.type == "favorites") {
      url = `${ENDPOINTS.collection.favoriteCollections}/all/${pageIndex}`;
    } else if (props.type == "profile") {
      url = `${ENDPOINTS.collection.userCollections}/${props.profile_id}/${pageIndex}`;
    } else if (props.type == "release") {
      url = `${ENDPOINTS.collection.releaseInCollections}/${props.release_id}/${pageIndex}`;
    }

    if (userStore.token) {
      url += `?token=${userStore.token}`;
    }

    return url;
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    useSWRfetcher,
    { initialSize: 2 }
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

  useEffect(() => {
    if (
      userStore.state === "finished" &&
      !userStore.token &&
      props.type == "favorites"
    ) {
      router.push(`/login?redirect=/collections/favorites`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userStore.state, userStore.token]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-w-full min-h-screen">
        <Spinner />
      </div>
    );
  };

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Ошибка</h1>
          <p className="text-lg">
            Произошла ошибка при загрузке коллекций. Попробуйте обновить страницу
            или зайдите позже.
          </p>
        </div>
      </main>
    );
  };

  return (
    <>
      {content && content.length > 0 ?
        <CollectionsSection
          sectionTitle={props.title}
          content={content}
          isMyCollections={
            props.type == "profile" &&
            userStore.user &&
            props.profile_id == userStore.user.id
          }
        />
      : <div className="flex flex-col items-center justify-center min-w-full gap-4 mt-12 text-xl">
          <span className="w-24 h-24 iconify-color twemoji--broken-heart"></span>
          <p>Тут пока ничего нет...</p>
        </div>
      }
      {data &&
        data[data.length - 1].current_page <
          data[data.length - 1].total_page_count && (
          <Button
            className="w-full"
            color={"light"}
            onClick={() => setSize(size + 1)}
          >
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 iconify mdi--plus-circle "></span>
              <span className="text-lg">Загрузить ещё</span>
            </div>
          </Button>
        )}
    </>
  );
}
