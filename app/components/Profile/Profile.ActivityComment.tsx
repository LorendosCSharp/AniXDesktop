import Link from "next/link";
import Image from "next/image";
import { sinceUnixDate, unixToDate } from "#/api/utils";

export const ProfileActivityComment = (props: {
  content: any;
  profile_id: number;
}) => {
  return (
    <>
      {props.content && props.content.length > 0 ?
        props.content.map((comment) => {
          let isHidden = comment.isSpoiler || comment.likes_count < -5 || false;
          return (
            <article
              className="px-4 py-2 text-sm bg-gray-100 rounded-lg sm:text-base dark:bg-gray-900"
              key={`comment-${comment.id}`}
            >
              <footer className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1">
                  <Link
                    href={`/profile/${comment.profile.id}`}
                    className="inline-flex items-center mr-3 text-sm font-semibold text-gray-900 dark:text-white hover:underline"
                  >
                    <Image
                      className="w-6 h-6 mr-2 rounded-full"
                      width={24}
                      height={24}
                      src={comment.profile.avatar}
                      alt=""
                    />
                    {comment.profile.login}
                  </Link>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <time
                      dateTime={comment.timestamp.toString()}
                      title={unixToDate(comment.timestamp, "full")}
                    >
                      {sinceUnixDate(comment.timestamp)}
                    </time>
                  </p>
                  <p
                    className={`text-sm font-medium border px-1 py-0.5 rounded-md text-center ml-4 min-w-8 ${
                      comment.likes_count > 0 ?
                        "text-green-500 dark:text-green-400 border-green-500 dark:border-green-400"
                      : comment.likes_count < 0 ?
                        "text-red-500 dark:text-red-400 border-red-500 dark:border-red-400"
                      : "text-gray-500 dark:text-gray-400 border-gray-500 dark:border-gray-400"
                    }`}
                  >
                    {comment.likes_count}
                  </p>
                </div>
              </footer>
              <div className="relative flex flex-col py-2">
                {comment.release && typeof comment.release != "number" && (
                  <Link href={`/release/${comment.release.id}`}>
                    <p className="text-gray-900 whitespace-pre-wrap dark:text-gray-500">
                      {!comment.isDeleted ?
                        `К релизу: ${comment.release.title_ru || comment.release.title_alt || comment.release.title_original} (${comment.release.year || "?"}) >>`
                      : ""}
                    </p>
                  </Link>
                )}
                <p className="text-gray-800 whitespace-pre-wrap dark:text-gray-400">
                  {!comment.isDeleted ?
                    comment.message
                  : "Комментарий был удалён."}
                </p>
                {isHidden && (
                  <button
                    className="absolute top-0 bottom-0 left-0 right-0"
                    onClick={() => isHidden == false}
                  >
                    <div className="min-w-full min-h-full px-2 py-1.5 rounded-md bg-black text-white bg-opacity-50 backdrop-blur-[8px] flex flex-col justify-center items-center">
                      <p>
                        {comment.likes_count < -5 ?
                          "У комментария слишком низкий рейтинг."
                        : "Данный комментарий может содержать спойлер."}
                      </p>
                      <p className="font-bold">Нажмите, чтобы прочитать</p>
                    </div>
                  </button>
                )}
              </div>
            </article>
          );
        })
      : <p className="text-lg">Пользователь не оставлял комментарии</p>}
    </>
  );
};
