import Link from "next/link";

export const AddCollectionLink = (props: any) => {
  return (
    <Link href={`/collections/create`}>
      <div className="flex flex-col items-center justify-center w-full gap-2 text-black transition-colors bg-gray-100 border hover:bg-gray-200 border-gray-50 hover:border-gray-100 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-500 aspect-video group dark:bg-gray-600 dark:text-white">
        <span className="w-8 h-8 iconify mdi--plus-circle dark:fill-white"></span>
        <p>Новая коллекция</p>
      </div>
    </Link>
  );
};
