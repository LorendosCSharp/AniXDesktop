"use client";

import { ENDPOINTS } from "#/api/config";
import { useEffect, useState } from "react";

export const ReleaseInfoStreaming = (props: { release_id: number }) => {
  const [data, setData] = useState(null);

  useEffect(() => {
    const _getData = async () => {
      const response = await fetch(
        `${ENDPOINTS.release.licensed}/${props.release_id}`
      );
      setData(await response.json());
    };
    _getData();
  }, [props.release_id]);

  return (
    <>
      {!data ?
        ""
      : !(data.content.length > 0) ?
        ""
      : <div>
          <div className="grid grid-flow-row-dense grid-cols-1 gap-1 2xl:grid-cols-2">
            {data.content.map((item: any) => {
              return (
                <a
                  href={item.url}
                  target="_blank"
                  key={`platform_${item.id}`}
                  className="flex items-center gap-2 px-4 py-2 transition-colors bg-gray-100 rounded-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 "
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img alt="" src={item.icon} className="w-6 h-6 rounded-full" />
                  <p className="text-sm line-clamp-2">{item.name}</p>
                </a>
              );
            })}
          </div>
        </div>
      }
    </>
  );
};
