import { BookmarksCategoryPage } from "#/pages/BookmarksCategory";
import { fetchDataViaGet } from "#/api/utils";
import type { Metadata, ResolvingMetadata } from "next";
export const dynamic = 'force-static';

const SectionTitleMapping = {
  watching: "Смотрю",
  planned: "В планах",
  watched: "Просмотрено",
  delayed: "Отложено",
  abandoned: "Заброшено",
};

export async function generateMetadata(
  { params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id: string = params.id;
  const { data, error } = await fetchDataViaGet(
    `https://api.anixart.tv/profile/${id}`
  );
  const previousOG = (await parent).openGraph;

  if (error) {
    return {
      title: "Ошибка",
      description: "Ошибка",
    };
  };

  return {
    title:"Закладки Пользователя - " + data.profile.login + " - " + SectionTitleMapping[params.slug],
    description: "Закладки Пользователя - " + data.profile.login + " - " + SectionTitleMapping[params.slug],
    openGraph: {
      ...previousOG,
      images: [
        {
          url: data.profile.avatar, // Must be an absolute URL
          width: 600,
          height: 600,
        },
      ],
    },
  };
}

export default function Index({ params }) {
  return (
    <BookmarksCategoryPage
      slug={params.slug}
      SectionTitleMapping={SectionTitleMapping}
      profile_id={params.id}
    />
  );
}
