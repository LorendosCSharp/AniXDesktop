"use client";
import { ReleaseSection } from "#/components/ReleaseSection/ReleaseSection";
import { Spinner } from "#/components/Spinner/Spinner";
import { useState, useEffect } from "react";
import { useScrollPosition } from "#/hooks/useScrollPosition";
import { useUserStore } from "../store/auth";
import { _FetchHomePageReleases } from "#/api/utils";
import { Button, ButtonGroup } from "flowbite-react";
import { useRouter } from "next/navigation";
import Filter from "components/Filter/Filter";



export function IndexCategoryPage(props) {
  const token = useUserStore((state) => state.token);
  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState(null);
  const [page, setPage] = useState(0);
  const router = useRouter();

  const [filtersModalOpen, setFiltersModalOpen] = useState(false);

  useEffect(() => {
    async function _loadInitialReleases() {
      setIsLoading(true);
      setContent(null);

      const data: any = await _FetchHomePageReleases(props.slug, token, page);

      setContent(data.content);
      setIsLoading(false);
    }

    _loadInitialReleases();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  useEffect(() => {
    async function _loadNextReleasesPage() {
      const data: any = await _FetchHomePageReleases(props.slug, token, page);
      const newContent = [...content, ...data.content];
      setContent(newContent);
    }
    if (content) {
      _loadNextReleasesPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const scrollPosition = useScrollPosition();
  useEffect(() => {
    if (scrollPosition == 98) {
      setPage(page + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition]);

  return (
    <>
      <div className="mb-4 overflow-auto inline-flex">
        <Filter isShown={filtersModalOpen} setShown={setFiltersModalOpen} />
        <Button className="whitespace-nowrap" color="light" onClick={() => setFiltersModalOpen(true)}>Фильтры</Button>

      </div >
      {content && content.length > 0 ? (
        <ReleaseSection
          sectionTitle={props.SectionTitleMapping[props.slug]}
          content={content}
        />
      ) : isLoading ? (
        <div className="flex flex-col items-center justify-center min-w-full min-h-screen">
          <Spinner />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-w-full gap-4 mt-12 text-xl">
          <span className="w-24 h-24 iconify-color twemoji--broken-heart"></span>
          <p>
            В списке {props.SectionTitleMapping[props.slug]} пока ничего нет...
          </p>
        </div>
      )
      }
      <Button
        className="w-full"
        color={"light"}
        onClick={() => setPage(page + 1)}
      >
        <div className="flex items-center gap-2">
          <span className="w-6 h-6 iconify mdi--plus-circle "></span>
          <span className="text-lg">Загрузить ещё</span>
        </div>
      </Button>
    </>
  );
}
