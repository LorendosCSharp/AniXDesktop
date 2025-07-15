"use client";
import { ENDPOINTS } from "#/api/config";
import { tryCatchAPI } from "#/api/utils";
import { Card, Button, useThemeMode } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import useSWR, { useSWRConfig } from "swr";

// null - не друзья
// 0 - заявка в друзья authUserId < profileId
// 1 - заявка в друзья authUserId > profileId
// 2 - друзья

// если id профиля больше id юзера, то 0 иначе 1

export const ProfileActions = (props: {
  isMyProfile: boolean;
  isFriendRequestsDisallowed: boolean;
  profile_id: number;
  my_profile_id: number;
  friendStatus: number;
  token: string;
  is_me_blocked: boolean;
  is_blocked: boolean;
  edit_isOpen: boolean;
  edit_setIsOpen: any;
}) => {
  const profileIdIsSmaller = props.my_profile_id < props.profile_id;
  const theme = useThemeMode();

  const { mutate } = useSWRConfig();
  const [actionsDisabled, setActionsDisabled] = useState(false);

  function _getFriendStatus() {
    const num = props.friendStatus;

    if (num == null) {
      return null;
    }
    let z = true;
    if (num == 2) {
      return 1;
    }
    let z3 =
      (num == 0 && profileIdIsSmaller) || (num == 1 && !profileIdIsSmaller);
    if ((num != 1 || profileIdIsSmaller) && (num != 0 || !profileIdIsSmaller)) {
      z = false;
    }
    if (z3) {
      return 2;
    }
    if (z) {
      return 3;
    }
    return 0;
  }
  const FriendStatus = _getFriendStatus();
  const isRequestedStatus =
    FriendStatus != null ?
      profileIdIsSmaller ? profileIdIsSmaller && FriendStatus != 0
      : !profileIdIsSmaller && FriendStatus == 2
    : null;
  // ^ This is some messed up shit

  async function _addToFriends() {
    setActionsDisabled(true);

    const tid = toast.loading("Добавляем в друзья...", {
      position: "bottom-center",
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      theme: theme.mode == "light" ? "light" : "dark",
    });

    let url = `${ENDPOINTS.user.profile}/friend/request`;
    FriendStatus == 1 ? (url += "/remove/")
    : isRequestedStatus ? (url += "/remove/")
    : (url += "/send/");
    url += `${props.profile_id}?token=${props.token}`;

    const { data, error } = await tryCatchAPI(fetch(url));

    if (error) {
      toast.update(tid, {
        render:
          FriendStatus == 1 || isRequestedStatus ?
            "Ошибка удаления из друзей"
          : "Ошибка добавления в друзья",
        type: "error",
        autoClose: 2500,
        isLoading: false,
        closeOnClick: true,
        draggable: true,
      });
      setActionsDisabled(false);
      return;
    }

    mutate(
      `${ENDPOINTS.user.profile}/${props.profile_id}?token=${props.token}`
    );

    toast.update(tid, {
      render:
        FriendStatus == 1 || isRequestedStatus ?
          "Удален из друзей"
        : "Добавлен в друзья",
      type: "success",
      autoClose: 2500,
      isLoading: false,
      closeOnClick: true,
      draggable: true,
    });

    setActionsDisabled(false);
  }

  async function _addToBlocklist() {
    setActionsDisabled(true);

    const tid = toast.loading(
      !props.is_blocked ?
        "Блокируем пользователя..."
      : "Разблокируем пользователя...",
      {
        position: "bottom-center",
        hideProgressBar: true,
        closeOnClick: false,
        pauseOnHover: false,
        draggable: false,
        theme: theme.mode == "light" ? "light" : "dark",
      }
    );

    let url = `${ENDPOINTS.user.profile}/blocklist`;
    !props.is_blocked ? (url += "/add/") : (url += "/remove/");
    url += `${props.profile_id}?token=${props.token}`;

    const { data, error } = await tryCatchAPI(fetch(url));
    if (error) {
      toast.update(tid, {
        render: !props.is_blocked ? "Ошибка блокировки" : "Ошибка разблокировки",
        type: "error",
        autoClose: 2500,
        isLoading: false,
        closeOnClick: true,
        draggable: true,
      });
      setActionsDisabled(false);
      return;
    }

    mutate(
      `${ENDPOINTS.user.profile}/${props.profile_id}?token=${props.token}`
    );

    toast.update(tid, {
      render:
        !props.is_blocked ?
          "Пользователь заблокирован"
        : "Пользователь разблокирован",
      type: "success",
      autoClose: 2500,
      isLoading: false,
      closeOnClick: true,
      draggable: true,
    });

    setActionsDisabled(false);
  }

  return (
    <Card className="h-fit">
      {isRequestedStatus != null && !isRequestedStatus && FriendStatus != 1 && (
        <p>Отправил(-а) вам заявку в друзья</p>
      )}
      <div className="flex gap-2">
        {props.isMyProfile && (
          <Button
            color={"blue"}
            onClick={() => props.edit_setIsOpen(!props.edit_isOpen)}
          >
            Редактировать
          </Button>
        )}
        {!props.isMyProfile && (
          <>
            {(!props.isFriendRequestsDisallowed ||
              FriendStatus == 1 ||
              isRequestedStatus) &&
              !props.is_me_blocked &&
              !props.is_blocked && (
                <Button
                  disabled={actionsDisabled}
                  color={
                    FriendStatus == 1 ? "red"
                    : isRequestedStatus ?
                      "light"
                    : "blue"
                  }
                  onClick={() => _addToFriends()}
                >
                  {FriendStatus == 1 ?
                    "Удалить из друзей"
                  : isRequestedStatus ?
                    "Заявка отправлена"
                  : "Добавить в друзья"}
                </Button>
              )}
            <Button
              color={!props.is_blocked ? "red" : "blue"}
              disabled={actionsDisabled}
              onClick={() => _addToBlocklist()}
            >
              {!props.is_blocked ? "Заблокировать" : "Разблокировать"}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};
