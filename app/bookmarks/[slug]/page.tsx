import { BookmarksCategoryPage } from "#/pages/BookmarksCategory";
export const dynamic = 'force-static';

const SectionTitleMapping = {
  watching: "Смотрю",
  planned: "В планах",
  watched: "Просмотрено",
  delayed: "Отложено",
  abandoned: "Заброшено",
};

export async function generateMetadata({ params }) {
  return {
    title: SectionTitleMapping[params.slug],
  };
}

export default function Index({ params }) {
  return (
    <BookmarksCategoryPage
      slug={params.slug}
      SectionTitleMapping={SectionTitleMapping}
    />
  );
}
