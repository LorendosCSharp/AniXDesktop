import { IndexCategoryPage } from "#/pages/IndexCategory";
export const dynamic = 'force-static';

const SectionTitleMapping = {
  last: "Последние релизы",
  finished: "Завершенные релизы",
  ongoing: "Выходит",
  announce: "Анонсированные релизы",
  films: "Фильмы",
};

export async function generateMetadata({ params }) {
  return {
    title: SectionTitleMapping[params.slug],
  };
}

export default function Index({ params }) {
  return (
    <IndexCategoryPage
      slug={params.slug}
      SectionTitleMapping={SectionTitleMapping}
    />
  );
}
