import { ENDPOINTS } from "#/api/config";
import { tryCatchAPI, unixToDate, useSWRfetcher } from "#/api/utils";
import { Avatar, Button, Modal, ModalHeader, useThemeMode } from "flowbite-react";
import { useCallback, useEffect, useState } from "react";
import useSWRInfinite from "swr/infinite";
import { Spinner } from "../Spinner/Spinner";
import { toast } from "react-toastify";

export const ProfileBlockedUsersModal = (props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  token: string;
  profile_id: number;
}) => {
  const [currentRef, setCurrentRef] = useState<any>(null);
  const theme = useThemeMode();
  const [actionsDisabled, setActionsDisabled] = useState(false);
  const [unblockedUsers, setUnblockedUsers] = useState([]);

  const modalRef = useCallback((ref) => {
    setCurrentRef(ref);
  }, []);

  const getKey = (pageIndex: number, previousPageData: any) => {
    if (previousPageData && !previousPageData.content.length) return null;
    let url = `${ENDPOINTS.user.blocklist}/all/${pageIndex}?token=${props.token}`;
    return url;
  };

  const { data, error, isLoading, size, setSize } = useSWRInfinite(
    getKey,
    useSWRfetcher,
    { initialSize: 2 }
  );

  async function _addToBlocklist(profile_id) {
    setActionsDisabled(true);

    const tid = toast.loading(
      unblockedUsers.includes(profile_id) ?
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

    let url = `${ENDPOINTS.user.blocklist}`;
    unblockedUsers.includes(profile_id) ?
      (url += "/add/")
    : (url += "/remove/");
    url += `${profile_id}?token=${props.token}`;

    const { data, error } = await tryCatchAPI(fetch(url));
    if (error) {
      toast.update(tid, {
        render:
          unblockedUsers.includes(profile_id) ?
            "Ошибка блокировки"
          : "Ошибка разблокировки",
        type: "error",
        autoClose: 2500,
        isLoading: false,
        closeOnClick: true,
        draggable: true,
      });
      setActionsDisabled(false);
      return;
    }

    toast.update(tid, {
      render:
        unblockedUsers.includes(profile_id) ?
          "Пользователь заблокирован"
        : "Пользователь разблокирован",
      type: "success",
      autoClose: 2500,
      isLoading: false,
      closeOnClick: true,
      draggable: true,
    });

    if (unblockedUsers.includes(profile_id)) {
      setUnblockedUsers((prev) => {
        return prev.filter((item) => item !== profile_id);
      });
    } else {
      setUnblockedUsers((prev) => {
        return [...prev, profile_id];
      });
    }
    setActionsDisabled(false);
  }

  const [content, setContent] = useState([]);
  useEffect(() => {
    if (data) {
      let allReleases = [];
      for (let i = 0; i < data.length; i++) {
        allReleases.push(...data[i].content);
      }
      setContent(allReleases);
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
        size={"7xl"}
      >
        <ModalHeader>Заблокированные пользователи</ModalHeader>
        <div
          className="flex flex-col gap-2 p-4 overflow-y-auto"
          onScroll={handleScroll}
          ref={modalRef}
        >
          {content && content.length > 0 ?
            content.map((user) => {
              return (
                <div className="flex items-center justify-between gap-2" key={`blockeduser-${user.id}`}>
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
                      <p>Заблокирован: {unixToDate(user.added_date, "full")}</p>
                    </div>
                  </div>
                  <Button
                    color={!unblockedUsers.includes(user.id) ? "blue" : "red"}
                    onClick={() => _addToBlocklist(user.id)}
                    disabled={actionsDisabled}
                    className="flex-grow-0 h-fit"
                  >
                    {!unblockedUsers.includes(user.id) ?
                      "Разблокировать"
                    : "Заблокировать"}
                  </Button>
                </div>
              );
            })
          : "Нет заблокированных пользователей"}
          {isLoading && <Spinner />}
        </div>
      </Modal>
    </>
  );
};
