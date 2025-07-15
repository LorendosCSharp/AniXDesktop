import { ENDPOINTS } from "#/api/config";
import { tryCatchAPI, unixToDate, useSWRfetcher } from "#/api/utils";
import {
  Avatar,
  Button,
  Modal,
  ModalHeader,
  useThemeMode,
} from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { Spinner } from "../Spinner/Spinner";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";
import Link from "next/link";

export const ProfileFriendModal = (props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  token: string;
  isMyProfile: boolean;
  profile_id: number;
}) => {
  const [currentRef, setCurrentRef] = useState<any>(null);
  const theme = useThemeMode();
  const [actionsDisabled, setActionsDisabled] = useState(false);
  // const [requestInUsers, setRequestInUsers] = useState([]);
  // const [requestOutUsers, setRequestOutUsers] = useState([]);
  const [friends, setFriends] = useState([]);

  const modalRef = useCallback((ref) => {
    setCurrentRef(ref);
  }, []);

  const useFetchRequests = (url: string) => {
    const { data, error, isLoading } = useSWR(url, useSWRfetcher);
    return [data, error, isLoading];
  };

  const [requestInUsersData, requestInUsersError, requestInUsersIsLoading] =
    useFetchRequests(
      props.isMyProfile ?
        `${ENDPOINTS.user.friend.in}/last?token=${props.token}&count=8`
      : ""
    );

  const [requestOutUsersData, requestOutUsersError, requestOutUsersIsLoading] =
    useFetchRequests(
      props.isMyProfile ?
        `${ENDPOINTS.user.friend.out}/last?token=${props.token}&count=8`
      : ""
    );

  async function _hideRequestIn(profile_id) {
    const tid = toast.loading("Скрываем заявку...", {
      position: "bottom-center",
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      theme: theme.mode == "light" ? "light" : "dark",
    });

    let url = `${ENDPOINTS.user.friend.hide}/${profile_id}?token=${props.token}`;
    const { data, error } = await tryCatchAPI(fetch(url));
    if (error) {
      toast.update(tid, {
        render: "Ошибка скрытия заявки",
        type: "error",
        autoClose: 2500,
        isLoading: false,
        closeOnClick: true,
        draggable: true,
      });
      return;
    }

    toast.update(tid, {
      render: "Заявка скрыта",
      type: "success",
      autoClose: 2500,
      isLoading: false,
      closeOnClick: true,
      draggable: true,
    });
    mutate(`${ENDPOINTS.user.friend.in}/last?token=${props.token}&count=8`);
  }

  async function _acceptRequestIn(profile_id) {
    const tid = toast.loading("Принимаем запрос...", {
      position: "bottom-center",
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      theme: theme.mode == "light" ? "light" : "dark",
    });

    let url = `${ENDPOINTS.user.friend.add}/${profile_id}?token=${props.token}`;
    const { data, error } = await tryCatchAPI(fetch(url));
    if (error) {
      toast.update(tid, {
        render: "Ошибка приёма запроса",
        type: "error",
        autoClose: 2500,
        isLoading: false,
        closeOnClick: true,
        draggable: true,
      });
      return;
    }

    toast.update(tid, {
      render: "Запрос принят",
      type: "success",
      autoClose: 2500,
      isLoading: false,
      closeOnClick: true,
      draggable: true,
    });
    mutate(`${ENDPOINTS.user.friend.in}/last?token=${props.token}&count=8`);
  }

  async function _cancelRequestOut(profile_id) {
    const tid = toast.loading("Отменяем запрос...", {
      position: "bottom-center",
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      theme: theme.mode == "light" ? "light" : "dark",
    });

    let url = `${ENDPOINTS.user.friend.remove}/${profile_id}?token=${props.token}`;
    const { data, error } = await tryCatchAPI(fetch(url));
    if (error) {
      toast.update(tid, {
        render: "Ошибка отмена запроса",
        type: "error",
        autoClose: 2500,
        isLoading: false,
        closeOnClick: true,
        draggable: true,
      });
      return;
    }

    toast.update(tid, {
      render: "Запрос отменён",
      type: "success",
      autoClose: 2500,
      isLoading: false,
      closeOnClick: true,
      draggable: true,
    });
    mutate(`${ENDPOINTS.user.friend.out}/last?token=${props.token}&count=8`);
  }

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.content.length) return null;
    let url = `${ENDPOINTS.user.friend.list}/${props.profile_id}/${pageIndex}?token=${props.token}`;
    return url;
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    useSWRfetcher,
    { initialSize: 2 }
  );

  useEffect(() => {
    if (data) {
      let allFriends = [];
      for (let i = 0; i < data.length; i++) {
        allFriends.push(...data[i].content);
      }
      setFriends(allFriends);
    }
  }, [data]);

  const [scrollPosition, setScrollPosition] = useState(0);
  function handleScroll() {
    const height = currentRef.scrollHeight - currentRef.clientHeight;
    const windowScroll = currentRef.scrollTop;
    const scrolled = (windowScroll / height) * 100;
    setScrollPosition(Math.floor(scrolled));
  }

  useEffect(() => {
    if (scrollPosition >= 95 && scrollPosition <= 96) {
      setSize(size + 1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollPosition]);

  return (
    <>
      <Modal
        dismissible
        show={props.isOpen}
        onClose={() => props.setIsOpen(false)}
        size={"4xl"}
      >
        <ModalHeader>Друзья</ModalHeader>
        <div
          className="flex flex-col gap-4 p-4 overflow-y-auto"
          onScroll={handleScroll}
          ref={modalRef}
        >
          {props.isMyProfile && (
            <>
              <div className="flex flex-col gap-2">
                <p className="text-lg font-semibold">Входящие заявки</p>
                {(
                  requestInUsersData &&
                  requestInUsersData.content &&
                  requestInUsersData.content.length > 0
                ) ?
                  requestInUsersData.content.map((user) => {
                    return (
                      <div
                        className="flex items-center justify-between gap-2"
                        key={`friend_req_in-${user.id}`}
                      >
                        <Link href={`/profile/${user.id}`}>
                          <div className="flex gap-2">
                            <Avatar
                              alt=""
                              img={user.avatar}
                              rounded={true}
                              size={"md"}
                              bordered={true}
                              color={user.is_online ? "success" : "light"}
                              className="flex-shrink-0"
                            />
                            <div className="flex flex-col gap-1">
                              <p className="text-lg font-semibold">
                                {user.login}
                              </p>
                              <p>Друзей: {user.friend_count}</p>
                            </div>
                          </div>
                        </Link>
                        <div className="flex gap-2">
                          <Button
                            color="blue"
                            onClick={() => _acceptRequestIn(user.id)}
                          >
                            Принять
                          </Button>
                          <Button
                            color="light"
                            onClick={() => _hideRequestIn(user.id)}
                          >
                            Скрыть
                          </Button>
                        </div>
                      </div>
                    );
                  })
                : <p className="text-sm">Нет входящих заявок</p>}
              </div>
              <div className="flex flex-col gap-2">
                <p className="text-lg font-semibold">Исходящие заявки</p>
                {(
                  requestOutUsersData &&
                  requestOutUsersData.content &&
                  requestOutUsersData.content.length > 0
                ) ?
                  requestOutUsersData.content.map((user) => {
                    return (
                      <div
                        className="flex items-center justify-between gap-2"
                        key={`friend_req_out-${user.id}`}
                      >
                        <Link href={`/profile/${user.id}`}>
                          <div className="flex gap-2">
                            <Avatar
                              alt=""
                              img={user.avatar}
                              rounded={true}
                              size={"md"}
                              bordered={true}
                              color={user.is_online ? "success" : "light"}
                              className="flex-shrink-0"
                            />
                            <div className="flex flex-col gap-1">
                              <p className="text-lg font-semibold">
                                {user.login}
                              </p>
                              <p>Друзей: {user.friend_count}</p>
                            </div>
                          </div>
                        </Link>
                        <div className="flex gap-2">
                          <Button
                            color="light"
                            onClick={() => _cancelRequestOut(user.id)}
                          >
                            Отменить
                          </Button>
                        </div>
                      </div>
                    );
                  })
                : <p className="text-sm">Нет исходящих заявок</p>}
              </div>
            </>
          )}
          <div className="flex flex-col gap-2">
            <p className="text-lg font-semibold">Все друзья</p>
            {friends && friends.length > 0 ?
              friends.map((user) => {
                return (
                  <div
                    className="flex items-center justify-between gap-2"
                    key={`friend-${user.id}`}
                  >
                    <Link href={`/profile/${user.id}`}>
                      <div className="flex gap-2">
                        <Avatar
                          alt=""
                          img={user.avatar}
                          rounded={true}
                          size={"md"}
                          bordered={true}
                          color={user.is_online ? "success" : "light"}
                          className="flex-shrink-0"
                        />
                        <div className="flex flex-col gap-1">
                          <p className="text-lg font-semibold">{user.login}</p>
                          <p>Друзей: {user.friend_count}</p>
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })
            : <p className="text-sm">Нет друзей</p>}
          </div>
          {isLoading && <Spinner />}
        </div>
      </Modal>
    </>
  );
};
