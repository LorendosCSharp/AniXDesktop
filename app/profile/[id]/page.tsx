import { ProfilePage } from "#/pages/Profile";
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
  }

  return {
    title: "Профиль - " + data.profile.login,
    description: data.profile.status,
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

export default async function Profile({ params }) {
  const id: string = params.id;
  return <ProfilePage id={id} />;
}
