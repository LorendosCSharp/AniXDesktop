import { Card, Button, Avatar } from "flowbite-react";
import { unixToDate } from "#/api/utils";
import Link from "next/link";
import Image from "next/image";

export const CollectionInfoBasics = (props: {
  image: string;
  title: string;
  description: string;
  authorAvatar: string;
  authorLogin: string;
  authorId: number;
  creationDate: number;
  updateDate: number;
}) => {
  return (
    <Card className="flex-1 w-full">
      <div className="flex flex-col justify-start gap-2">
        <div className="flex flex-col items-end justify-between sm:items-center sm:flex-row">
          <div className="flex flex-col gap-1">
            <p>создана: {unixToDate(props.creationDate, "full")}</p>
            <p>обновлена: {unixToDate(props.updateDate, "full")}</p>
          </div>
          <Link href={`/profile/${props.authorId}`}>
            <Avatar
              img={props.authorAvatar}
              rounded={true}
              bordered={true}
              size="md"
              className="flex-row-reverse gap-2"
            >
              <div className="font-medium dark:text-white">
                <div className="text-lg">{props.authorLogin}</div>
                <div className="text-right text-gray-500">Автор</div>
              </div>
            </Avatar>
          </Link>
        </div>
        <div className="min-w-full aspect-video">
          <Image
            src={props.image}
            width={725}
            height={400}
            className="w-full rounded-lg"
            alt=""
          />
        </div>
        <div className="flex flex-col gap-1">
          <p className="text-xl font-bold">{props.title}</p>
          <p className="whitespace-pre-wrap">{props.description}</p>
        </div>
      </div>
    </Card>
  );
};
