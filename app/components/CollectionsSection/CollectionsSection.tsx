import { CollectionLink } from "../CollectionLink/CollectionLink";
import { AddCollectionLink } from "../AddCollectionLink/AddCollectionLink";

export const CollectionsSection = (props: {
  sectionTitle?: string;
  content: any;
  isMyCollections?: boolean;
}) => {
  return (
    <section>
      {props.sectionTitle && (
        <div className="flex justify-between px-4 py-2 border-b-2 border-black dark:border-white">
          <h1 className="font-bold text-md sm:text-xl md:text-lg xl:text-xl">
            {props.sectionTitle}
          </h1>
        </div>
      )}
      <div className="m-4">
        <div className="grid justify-center sm:grid-cols-[repeat(auto-fit,minmax(400px,1fr))] grid-cols-[100%] gap-2">
          {props.isMyCollections && <AddCollectionLink />}
          {props.content.map((collection) => {
            return (
              <div key={collection.id} className="w-full h-full aspect-video">
                <CollectionLink {...collection} />
              </div>
            );
          })}
          {props.content.length == 1 && !props.isMyCollections && <div></div>}
        </div>
      </div>
    </section>
  );
};
