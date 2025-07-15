import { Card } from "flowbite-react";
import Image from "next/image";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

export const ReleaseInfoScreenshots = (props: { images: string[] }) => {
  return (
    <Card>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={8}
        slidesPerView={2}
        direction={"horizontal"}
        allowTouchMove={true}
        autoplay={true}
        pagination={true}
        breakpoints={{
          1024: {
            slidesPerView: 1,
          },
        }}
        style={{
          height: "100%",
          minHeight: 0,
          maxHeight: "100%",
          width: "100%",
          minWidth: 0,
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        {props.images.map((image: string, index: number) => {
          return (
            <SwiperSlide
              key={`release-screenshot-${index}`}
              style={{
                width: "fit-content",
                flexShrink: 0,
                display: "block",
                height: "100%",
                maxHeight: "100%",
              }}
            >
              <Image
                key={index}
                className="object-cover"
                src={image}
                width={400}
                height={225}
                alt=""
              />
            </SwiperSlide>
          );
        })}
      </Swiper>
    </Card>
  );
};
