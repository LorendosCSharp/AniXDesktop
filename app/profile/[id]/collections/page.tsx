import { CollectionsFullPage } from "#/pages/CollectionsFull";
import { fetchDataViaGet } from "#/api/utils";
import type { Metadata, ResolvingMetadata } from "next";
export const dynamic = "force-static";

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
    title: "Коллекции Пользователя - " + data.profile.login,
    description: "Коллекции Пользователя - " + data.profile.login,
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
};

export default async function Collections({ params }) {
  const { data, error } = await fetchDataViaGet(
    `https://api.anixart.tv/profile/${params.id}`
  );

  if (error) {
    return (
      <main className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold">Ошибка</h1>
          <p className="text-lg">
            Произошла ошибка при загрузке коллекций пользователя. Попробуйте
            обновить страницу или зайдите позже.
          </p>
        </div>
      </main>
    );
  }

  return (
    <CollectionsFullPage
      type="profile"
      title={`Коллекции пользователя: ${data.profile.login}`}
      profile_id={params.id}
    />
  );
};
