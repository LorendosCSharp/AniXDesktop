import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/mousewheel";
import "swiper/css/scrollbar";
import { Navigation, Mousewheel, Scrollbar } from "swiper/modules";
import { CollectionLink } from "../CollectionLink/CollectionLink";
import Link from "next/link";

export const ProfileActivityCollections = (props: {
  content: any;
  profile_id: number;
}) => {
  return (
    <div className="max-w-full">
      <Swiper
        modules={[Navigation, Mousewheel, Scrollbar]}
        spaceBetween={8}
        slidesPerView={"auto"}
        direction={"horizontal"}
        mousewheel={{
          enabled: true,
          sensitivity: 4,
        }}
        scrollbar={{
          enabled: true,
          draggable: true,
        }}
        allowTouchMove={true}
        style={
          {
            "--swiper-scrollbar-bottom": "0",
          } as React.CSSProperties
        }
      >
        {props.content &&
          props.content.length > 0 &&
          props.content.map((collection) => {
            return (
              <SwiperSlide
                key={`col-prev-${collection.id}`}
                style={{ width: "fit-content" }}
              >
                <div className="w-[350px] xl:w-[500px] aspect-video">
                  <CollectionLink {...collection} />
                </div>
              </SwiperSlide>
            );
          })}

        {props.content && props.content.length > 0 ?
          <SwiperSlide style={{ width: "fit-content" }}>
            <Link href={`/profile/${props.profile_id}/collections`}>
              <div className="w-[350px] xl:w-[500px] flex flex-col items-center justify-center gap-2 text-black transition-colors bg-gray-100 border hover:bg-gray-200 border-gray-50 hover:border-gray-100 dark:border-gray-700 dark:hover:border-gray-600 dark:hover:bg-gray-500 aspect-video group dark:bg-gray-600 dark:text-white">
                <span className="w-8 h-8 iconify mdi--arrow-right dark:fill-white"></span>
                <p>Все коллекции</p>
              </div>
            </Link>
          </SwiperSlide>
        : <p className="text-lg">У пользователя нет коллекций</p>}
      </Swiper>
    </div>
  );
};
