"use client";

import { Modal, ModalBody, ModalHeader, useThemeMode } from "flowbite-react";
import { ENDPOINTS } from "#/api/config";
import { useState } from "react";
import { toast } from "react-toastify";
import { tryCatchAPI } from "#/api/utils";

export const ProfileEditPrivacyModal = (props: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  token: string;
  setting: string;
  privacySettings: {
    privacy_stats: number;
    privacy_counts: number;
    privacy_social: number;
    privacy_friend_requests: number;
  };
  setPrivacySettings: (privacySettings: any) => void;
}) => {
  const setting_text = {
    privacy_stats: "Кто видит мою статистику, оценки и историю просмотра",
    privacy_counts:
      "Кто видит в профиле мои комментарии, коллекции, видео и друзей",
    privacy_social: "Кто видит в профиле мои социальные сети",
    privacy_friend_requests: "Кто может отправлять мне заявки в друзья",
  };

  const _endpoints = {
    privacy_stats: `${ENDPOINTS.user.settings.privacy.stats}?token=${props.token}`,
    privacy_counts: `${ENDPOINTS.user.settings.privacy.counts}?token=${props.token}`,
    privacy_social: `${ENDPOINTS.user.settings.privacy.socials}?token=${props.token}`,
    privacy_friend_requests: `${ENDPOINTS.user.settings.privacy.friendRequests}?token=${props.token}`,
  };

  const [loading, setLoading] = useState(false);
  const theme = useThemeMode();

  async function _setPrivacySetting(el: any) {
    let privacySettings = structuredClone(props.privacySettings);
    setLoading(true);

    const tid = toast.loading("Обновление настроек приватности...", {
      position: "bottom-center",
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: false,
      draggable: false,
      theme: theme.mode == "light" ? "light" : "dark",
    });

    const { data, error } = await tryCatchAPI(
      fetch(_endpoints[props.setting], {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          permission: el.target.value,
        }),
      })
    );

    if (error) {
      toast.update(tid, {
        render: "Ошибка обновления настроек приватности",
        type: "error",
        autoClose: 2500,
        isLoading: false,
        closeOnClick: true,
        draggable: true,
      });

      setLoading(false);
      return;
    }

    toast.update(tid, {
      render: "Настройки приватности обновлены",
      type: "success",
      autoClose: 2500,
      isLoading: false,
      closeOnClick: true,
      draggable: true,
    });

    setLoading(false);
    privacySettings[el.target.name] = el.target.value;
    props.setPrivacySettings(privacySettings);
    props.setIsOpen(false);
  }

  return (
    <Modal
      dismissible
      show={props.isOpen}
      onClose={() => props.setIsOpen(false)}
      size={"4xl"}
    >
      <ModalHeader>{setting_text[props.setting]}</ModalHeader>
      <ModalBody>
        {props.setting != "none" ?
          <>
            <div className="flex flex-col gap-2">
              {props.setting == "privacy_friend_requests" ?
                <>
                  <div className="flex items-center">
                    <input
                      disabled={loading}
                      onChange={(e) => _setPrivacySetting(e)}
                      checked={props.privacySettings[props.setting] == 0}
                      id="default-radio-1"
                      type="radio"
                      value={0}
                      name={props.setting}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="default-radio-1"
                      className="text-base text-gray-900 ms-2 dark:text-gray-300"
                    >
                      Все пользователи
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      disabled={loading}
                      onChange={(e) => _setPrivacySetting(e)}
                      checked={props.privacySettings[props.setting] == 1}
                      id="default-radio-2"
                      type="radio"
                      value={1}
                      name={props.setting}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="default-radio-2"
                      className="text-base text-gray-900 ms-2 dark:text-gray-300"
                    >
                      Никто
                    </label>
                  </div>
                </>
              : <>
                  <div className="flex items-center">
                    <input
                      disabled={loading}
                      onChange={(e) => _setPrivacySetting(e)}
                      checked={props.privacySettings[props.setting] == 0}
                      id="default-radio-1"
                      type="radio"
                      value={0}
                      name={props.setting}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="default-radio-1"
                      className="text-base text-gray-900 ms-2 dark:text-gray-300"
                    >
                      Все пользователи
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      disabled={loading}
                      onChange={(e) => _setPrivacySetting(e)}
                      checked={props.privacySettings[props.setting] == 1}
                      id="default-radio-2"
                      type="radio"
                      value={1}
                      name={props.setting}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="default-radio-2"
                      className="text-base text-gray-900 ms-2 dark:text-gray-300"
                    >
                      Только друзья
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      disabled={loading}
                      onChange={(e) => _setPrivacySetting(e)}
                      checked={props.privacySettings[props.setting] == 2}
                      id="default-radio-3"
                      type="radio"
                      value={2}
                      name={props.setting}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor="default-radio-3"
                      className="text-base text-gray-900 ms-2 dark:text-gray-300"
                    >
                      Только я
                    </label>
                  </div>
                </>
              }
            </div>
          </>
        : ""}
      </ModalBody>
    </Modal>
  );
};
