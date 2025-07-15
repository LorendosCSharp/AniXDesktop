"use client";

import {
  Button,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  TextInput,
  useThemeMode,
} from "flowbite-react";
import { Spinner } from "../Spinner/Spinner";
import { ENDPOINTS } from "#/api/config";
import { useEffect, useState } from "react";
import { useSWRConfig } from "swr";
import { toast } from "react-toastify";
import { tryCatchAPI } from "#/api/utils";

export const ProfileEditSocialModal = (props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  token: string;
  profile_id: number;
}) => {
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [socials, setSocials] = useState({
    vkPage: "",
    tgPage: "",
    discordPage: "",
    instPage: "",
    ttPage: "",
  });
  const { mutate } = useSWRConfig();
  const theme = useThemeMode();

  function _addUrl(username: string, social: string) {
    if (!username) {
      return "";
    }
    if (username.startsWith("h")) {
      return username;
    }
    switch (social) {
      case "vk":
        return `https://vk.com/${username}`;
      case "tg":
        return `https://t.me/${username}`;
      case "inst":
        return `https://instagram.com/${username}`;
      case "tt":
        return `https://tiktok.com/@${username}`;
    }
  }

  function _removeUrl(link: string) {
    if (link.startsWith("https://")) {
      const split = link.split("/");
      return split[split.length - 1];
    } else {
      return link;
    }
  }

  useEffect(() => {
    async function _fetchSettings() {
      setLoading(true);

      const { data, error } = await tryCatchAPI(
        fetch(`${ENDPOINTS.user.settings.socials.info}?token=${props.token}`)
      );

      if (error) {
        toast.error("Ошибка получения соц. сетей", {
          type: "error",
          autoClose: 2500,
          isLoading: false,
          closeOnClick: true,
          draggable: true,
        });

        setLoading(false);
        props.setIsOpen(false);
        return;
      }

      setSocials({
        vkPage: data.vk_page,
        tgPage: data.tg_page,
        discordPage: data.discord_page,
        instPage: data.inst_page,
        ttPage: data.tt_page,
      });
      setLoading(false);
    }
    _fetchSettings();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.isOpen]);

  function handleInput(e: any) {
    const social = {
      ...socials,
      [e.target.name]: e.target.value,
    };
    setSocials(social);
  }

  async function _setSocialSetting() {
    const body = {
      vkPage: _removeUrl(socials.vkPage),
      tgPage: _removeUrl(socials.tgPage),
      discordPage: _removeUrl(socials.discordPage),
      instPage: _removeUrl(socials.instPage),
      ttPage: _removeUrl(socials.ttPage),
    };

    setUpdating(true);
    const tid = toast.loading("Обновление соц. сетей...", {
      position: "bottom-center",
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      theme: theme.mode == "light" ? "light" : "dark",
    });

    const { data, error } = await tryCatchAPI(
      fetch(`${ENDPOINTS.user.settings.socials.edit}?token=${props.token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      })
    );

    if (error) {
      toast.update(tid, {
        render: "Ошибка обновления соц. сетей",
        type: "error",
        autoClose: 2500,
        isLoading: false,
        closeOnClick: true,
        draggable: true,
      });

      setUpdating(false);
      return;
    }

    toast.update(tid, {
      render: "Соц. сети обновлены",
      type: "success",
      autoClose: 2500,
      isLoading: false,
      closeOnClick: true,
      draggable: true,
    });

    mutate(
      `${ENDPOINTS.user.profile}/${props.profile_id}?token=${props.token}`
    );
    setUpdating(false);
    props.setIsOpen(false);
  }

  return (
    <Modal
      dismissible
      show={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      size={"4xl"}
    >
      <ModalHeader>Соц. сети</ModalHeader>
      <ModalBody>
        <p className="p-2 text-gray-400 border-2 border-gray-200 rounded-md dark:border-gray-500 dark:text-gray-300">
          Укажите ссылки на свои социальные сети, чтобы другие пользователи
          могли с вами связаться
        </p>
        {loading ?
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        : <div className="flex flex-col gap-4 py-4">
            <div>
              <div className="block mb-2">
                <Label htmlFor="vk-page">ВКонтакте</Label>
              </div>
              <TextInput
                id="vk-page"
                name="vkPage"
                onChange={(e) => handleInput(e)}
                value={_addUrl(socials.vkPage, "vk")}
                placeholder="Ссылка или никнейм"
              />
            </div>
            <div>
              <div className="block mb-2">
                <Label htmlFor="tg-page">Telegram</Label>
              </div>
              <TextInput
                id="tg-page"
                name="tgPage"
                onChange={(e) => handleInput(e)}
                value={_addUrl(socials.tgPage, "tg")}
                placeholder="Ссылка или никнейм"
              />
            </div>
            <div>
              <div className="block mb-2">
                <Label htmlFor="discord-page">Discord</Label>
              </div>
              <TextInput
                id="discord-page"
                name="discordPage"
                onChange={(e) => handleInput(e)}
                value={socials.discordPage}
                placeholder="Никнейм"
              />
            </div>
            <div>
              <div className="block mb-2">
                <Label htmlFor="inst-page">Instagram</Label>
              </div>
              <TextInput
                id="inst-page"
                name="instPage"
                onChange={(e) => handleInput(e)}
                value={_addUrl(socials.instPage, "inst")}
                placeholder="Ссылка или никнейм"
              />
            </div>
            <div>
              <div className="block mb-2">
                <Label htmlFor="tt-page">TikTok</Label>
              </div>
              <TextInput
                id="tt-page"
                name="ttPage"
                onChange={(e) => handleInput(e)}
                value={_addUrl(socials.ttPage, "tt")}
                placeholder="Ссылка или никнейм"
              />
            </div>
          </div>
        }
      </ModalBody>
      <ModalFooter>
        <Button
          color="blue"
          onClick={() => _setSocialSetting()}
          disabled={updating}
        >
          Сохранить
        </Button>
        <Button
          color="red"
          onClick={() => props.setIsOpen(false)}
          disabled={updating}
        >
          Отмена
        </Button>
      </ModalFooter>
    </Modal>
  );
};
