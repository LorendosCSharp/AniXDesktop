import { ViewCollectionPage } from "#/pages/ViewCollection";
import { fetchDataViaGet } from "#/api/utils";
import type { Metadata, ResolvingMetadata } from "next";
export const dynamic = "force-static";

export async function generateMetadata(
  { params },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const { data, error } = await fetchDataViaGet(
    `https://api.anixart.tv/collection/${id}`
  );
  const previousOG = (await parent).openGraph;

  if (error) {
    return {
      title: "Приватная коллекция",
      description: "Приватная коллекция",
    };
  }

  return {
    title:
      data.collection ?
        "коллекция - " + data.collection.title
      : "Приватная коллекция",
    description: data.collection && data.collection.description,
    openGraph: {
      ...previousOG,
      images: [
        {
          url: data.collection && data.collection.image, // Must be an absolute URL
          width: 600,
          height: 800,
        },
      ],
    },
  };
}

export default async function Collections({ params }) {
  return <ViewCollectionPage id={params.id} />;
}
