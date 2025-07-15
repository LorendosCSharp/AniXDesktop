import { Avatar, Card } from "flowbite-react";
import Link from "next/link";

export const UserSection = (props: { sectionTitle?: string; content: any }) => {
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
        <div className="flex flex-wrap gap-4">
          {props.content.map((user) => {
            return (
              <Link href={`/profile/${user.id}`} key={user.id} className="w-full max-w-[234px] h-full max-h-[234px] aspect-square flex-shrink-0">
                <Card className="items-center justify-center w-full h-full">
                  <Avatar img={user.avatar} alt={user.login || ""} size="lg" rounded={true} />
                  <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                    {user.login}
                  </h5>
                </Card>
              </Link>
            );
          })}
          {props.content.length == 1 && <div></div>}
        </div>
      </div>
    </section>
  );
};
