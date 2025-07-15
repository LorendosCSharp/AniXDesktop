import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/mousewheel";
import "swiper/css/scrollbar";
import { Navigation, Mousewheel, Scrollbar } from "swiper/modules";
import Link from "next/link";
import { Avatar, Button } from "flowbite-react";
import { useState } from "react";
import { ProfileFriendModal } from "./Profile.FriendsModal";

export const ProfileActivityFriends = (props: {
  content: any;
  token: string;
  isMyProfile: boolean;
  profile_id: number;
}) => {
  const [isFriendModalOpen, setIsFriendModalOpen] = useState(false);

  return (
    <>
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
            props.content.map((profile) => {
              return (
                <SwiperSlide
                  key={`friend-prev-${profile.id}`}
                  style={{ width: "fit-content" }}
                  className="px-2 py-4"
                >
                  <Link href={`/profile/${profile.id}`}>
                    <div className="flex items-center gap-2">
                      <Avatar
                        img={profile.avatar}
                        size="md"
                        rounded={true}
                        bordered={true}
                        color={profile.is_online ? "success" : "light"}
                        className="flex-shrink-0"
                      />
                      <p className="text-lg">{profile.login}</p>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          {(props.content && props.content.length > 0) || props.isMyProfile ?
            <SwiperSlide style={{ width: "fit-content" }} className="px-2 py-4">
              <Button onClick={() => setIsFriendModalOpen(true)}>
                <p className="text-lg">Все друзья {props.isMyProfile ? "и заявки" : ""}</p>
                <span className="w-8 h-8 iconify mdi--arrow-right dark:fill-white"></span>
              </Button>
            </SwiperSlide>
          : <p className="text-lg">У пользователя нет друзей</p>}
        </Swiper>
      </div>
      <ProfileFriendModal
        isOpen={isFriendModalOpen}
        setIsOpen={setIsFriendModalOpen}
        token={props.token}
        isMyProfile={props.isMyProfile}
        profile_id={props.profile_id}
      ></ProfileFriendModal>
    </>
  );
};
