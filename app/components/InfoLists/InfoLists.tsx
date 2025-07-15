import { Card } from "flowbite-react";

export const InfoLists = (props: {
  completed: number;
  planned: number;
  abandoned: number;
  delayed: number;
  watching: number;
  total?: number;
}) => {
  const total =
    props.total ||
    props.watching +
      props.planned +
      props.completed +
      props.delayed +
      props.abandoned;

  return (
    <Card className="w-full h-fit ">
      <div
        className="flex w-full h-8 overflow-hidden rounded-md"
        style={
          {
            "--width-of-one": "5",
            "--watching-percent": `calc(var(--width-of-one) * (${props.watching} / ${total} * 100%))`,
            "--planned-percent": `calc(var(--width-of-one) * (${props.planned} / ${total} * 100%))`,
            "--watched-percent": `calc(var(--width-of-one) * (${props.completed} / ${total} * 100%))`,
            "--delayed-percent": `calc(var(--width-of-one) * (${props.delayed} / ${total} * 100%))`,
            "--abandoned-percent": `calc(var(--width-of-one) * (${props.abandoned} / ${total} * 100%))`,
            "--no-list-percent": `calc(var(--width-of-one) * (${
              total -
              (props.watching +
                props.planned +
                props.completed +
                props.delayed +
                props.abandoned)
            } / ${total} * 100%))`,
          } as React.CSSProperties
        }
      >
        <div className={`bg-green-500 w-[var(--watching-percent)]`}></div>
        <div className={`bg-purple-500 w-[var(--planned-percent)]`}></div>
        <div className={`bg-blue-500 w-[var(--watched-percent)]`}></div>
        <div className={`bg-yellow-300 w-[var(--delayed-percent)]`}></div>
        <div className={`bg-red-500 w-[var(--abandoned-percent)]`}></div>
        <div className={`bg-gray-400 w-[var(--no-list-percent)]`}></div>
      </div>
      <div className="flex flex-wrap w-full gap-4">
        <p>
          <span className="inline-block w-3 h-3 mr-2 bg-green-500 rounded-sm"></span>
          Смотрю <span className="font-bold">{props.watching}</span>
        </p>
        <p>
          <span className="inline-block w-3 h-3 mr-2 bg-purple-500 rounded-sm"></span>
          В планах <span className="font-bold">{props.planned}</span>
        </p>
        <p>
          <span className="inline-block w-3 h-3 mr-2 bg-blue-500 rounded-sm"></span>
          Просмотрено <span className="font-bold">{props.completed}</span>
        </p>
        <p>
          <span className="inline-block w-3 h-3 mr-2 bg-yellow-300 rounded-sm"></span>
          Отложено <span className="font-bold">{props.delayed}</span>
        </p>
        <p>
          <span className="inline-block w-3 h-3 mr-2 bg-red-500 rounded-sm"></span>
          Брошено <span className="font-bold">{props.abandoned}</span>
        </p>
      </div>
    </Card>
  );
};
