"use client";

import { Button, Modal, ModalBody, ModalFooter, ModalHeader, Textarea, useThemeMode } from "flowbite-react";
import { ENDPOINTS } from "#/api/config";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { Spinner } from "../Spinner/Spinner";
import { unixToDate } from "#/api/utils";
import { toast } from "react-toastify";
import { tryCatchAPI } from "#/api/utils";
import { useUserStore } from "#/store/auth";

export const ProfileEditLoginModal = (props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  token: string;
  setLogin: (status: string) => void;
  profile_id: number;
}) => {
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [_login, _setLogin] = useState("");
  const [_loginData, _setLoginData] = useState({
    code: 0,
    avatar: "",
    login: "",
    is_change_available: false,
    last_change_at: 0,
    next_change_available_at: 0,
  });
  const [_loginLength, _setLoginLength] = useState(0);
  const { mutate } = useSWRConfig();
  const userStore = useUserStore();
  const theme = useThemeMode();

  useEffect(() => {
    async function _fetchLogin() {
      setLoading(true);

      const { data, error } = await tryCatchAPI(
        fetch(`${ENDPOINTS.user.settings.login.info}?token=${props.token}`)
      );

      if (error) {
        toast.error("Ошибка получения текущего никнейма", {
          autoClose: 2500,
          isLoading: false,
          closeOnClick: true,
          draggable: true,
        });
        setLoading(false);
        props.setIsOpen(false);
        return;
      }
      _setLoginData(data);
      _setLogin(data.login);
      _setLoginLength(data.login.length);
      setLoading(false);
    }
    _fetchLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen]);

  function handleInput(e: any) {
    _setLogin(e.target.value);
    _setLoginLength(e.target.value.length);
  }

  async function _setLoginSetting() {
    if (!_login || _login == "") {
      toast.error("Никнейм не может быть пустым", {
        autoClose: 2500,
        isLoading: false,
        closeOnClick: true,
        draggable: true,
      });
      return;
    }

    setSending(true);

    const tid = toast.loading("Обновляем никнейм...", {
      position: "bottom-center",
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      theme: theme.mode == "light" ? "light" : "dark",
    });

    const { data, error } = await tryCatchAPI(
      fetch(
        `${ENDPOINTS.user.settings.login.change}?login=${encodeURIComponent(
          _login
        )}&token=${props.token}`
      )
    );

    if (error) {
      let message = `Ошибка обновления никнейма: ${error.code}`;
      if (error.code == 3) {
        message = "Данный никнейм уже существует, попробуйте другой";
      }
      toast.update(tid, {
        render: message,
        type: "error",
        autoClose: 2500,
        isLoading: false,
        closeOnClick: true,
        draggable: true,
      });
      setSending(false);
      return;
    }

    toast.update(tid, {
      render: "Никнейм обновлён",
      type: "success",
      autoClose: 2500,
      isLoading: false,
      closeOnClick: true,
      draggable: true,
    });

    mutate(
      `${ENDPOINTS.user.profile}/${props.profile_id}?token=${props.token}`
    );
    userStore.checkAuth();
    props.setLogin(_login);
    setSending(false);
    props.setIsOpen(false);
  }

  return (
    <Modal
      dismissible
      show={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      size={"4xl"}
    >
      <ModalHeader>Изменить никнейм</ModalHeader>
      <ModalBody>
        {loading ?
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        : <>
            {!_loginData.is_change_available ?
              <>
                <p>Вы недавно изменили никнейм</p>
                <p>
                  следующее изменение будет доступно:{" "}
                  <span className="font-bold">
                    {unixToDate(_loginData.next_change_available_at, "full")}
                  </span>
                </p>
              </>
            : <>
                <Textarea
                  disabled={sending}
                  rows={1}
                  id="login"
                  className="w-full"
                  name="login"
                  onChange={(e) => handleInput(e)}
                  value={_login}
                  maxLength={20}
                />
                <p className="text-sm text-right text-gray-500 dark:text-gray-300">
                  {_loginLength}/20
                </p>
              </>
            }
          </>
        }
      </ModalBody>
      <ModalFooter>
        {_loginData.is_change_available && (
          <Button
            color="blue"
            onClick={() => _setLoginSetting()}
            disabled={sending || loading}
          >
            Сохранить
          </Button>
        )}
        <Button
          color="red"
          onClick={() => props.setIsOpen(false)}
          disabled={sending || loading}
        >
          Отмена
        </Button>
      </ModalFooter>
    </Modal>
  );
};
