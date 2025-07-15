import { Card, Button } from "flowbite-react";
import { useState } from "react";
import Image from "next/image";
import { ReleaseInfoStreaming } from "./ReleaseInfo.LicensedPlatforms";
import { Poster } from "../ReleasePoster/Poster";

export const ReleaseInfoBasics = (props: {
  release_id: number;
  image: string;
  title: { ru: string; original: string };
  note: string | null;
  description: string;
}) => {
  const [isFullDescription, setIsFullDescription] = useState(false);

  return (
    <Card className="h-full row-span-2">
      <div className="flex flex-col w-full h-full gap-4 lg:grid lg:grid-cols-[1fr_2fr] items-center lg:items-start justify-center lg:justify-start">
        <div className="flex flex-col gap-2">
          <div className="relative flex items-center justify-center w-full overflow-hidden rounded-lg">
            <Poster
              image={props.image}
              className="z-10 sm:scale-95 lg:scale-100"
            />
            <Poster
              image={props.image}
              className="absolute top-0 left-0 w-full scale-125 opacity-75 blur-xl brightness-75"
            />
          </div>
          <ReleaseInfoStreaming release_id={props.release_id} />
        </div>
        <div className="flex flex-col max-w-2xl gap-2 text-sm md:text-base">
          <div className="flex flex-col gap-1">
            <p className="text-xl font-bold text-black md:text-2xl dark:text-white">
              {props.title.ru}
            </p>
            <p className="text-sm text-gray-500 md:text-base dark:text-gray-400">
              {props.title.original}
            </p>
          </div>
          {props.note && (
            <div className="py-2 bg-blue-100 border-l-4 border-blue-700 rounded-tr-md rounded-br-md dark:bg-blue-900">
              <div id="note" className="ml-2"></div>
            </div>
          )}
          <p
            className={`overflow-y-hidden transition-[max-height] max-h-[var(--max-height)] md:max-h-full`}
            style={
              {
                "--max-height": isFullDescription ? "1000px" : "80px",
              } as React.CSSProperties
            }
          >
            {props.description}
          </p>
          <Button
            onClick={() => setIsFullDescription(!isFullDescription)}
            color="light"
            size={"sm"}
            className={`md:hidden block}`}
          >
            {isFullDescription ? "Скрыть" : "Показать полностью"}
          </Button>
        </div>
      </div>
    </Card>
  );
};
