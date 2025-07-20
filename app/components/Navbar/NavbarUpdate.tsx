"use client";

import Link from "next/link";
import Image from "next/image";
import { useUserStore } from "#/store/auth";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SettingsModal } from "#/components/SettingsModal/SettingsModal";
import { usePreferencesStore } from "#/store/preferences";

export const Navbar = () => {
  const pathname = usePathname();
  const userStore = useUserStore();
  const [isSettingModalOpen, setIsSettingModalOpen] = useState(false);
  const preferenceStore = usePreferencesStore();

  const menuItems = [
    {
      id: 1,
      title: "Домашняя",
      href: "/",
      hrefInCategory: "/home",
      icon: {
        default: "material-symbols--home-outline",
        active: "material-symbols--home",
      },
      isAuthRequired: false,
      isShownOnMobile: true,
    },
    {
      id: 2,
      title: "Поиск",
      href: "/search",
      icon: {
        default: "material-symbols--search",
        active: "material-symbols--search",
      },
      isAuthRequired: false,
      isShownOnMobile: true,
    },
    {
      id: 3,
      title: "Закладки",
      href: "/bookmarks",
      icon: {
        default: "material-symbols--bookmarks-outline",
        active: "material-symbols--bookmarks",
      },
      isAuthRequired: true,
      isShownOnMobile: true,
    },
    {
      id: 4,
      title: "Избранное",
      href: "/favorites",
      icon: {
        default: "material-symbols--favorite-outline",
        active: "material-symbols--favorite",
      },
      isAuthRequired: true,
      isShownOnMobile: false,
    },
    {
      id: 5,
      title: "Коллекции",
      href: "/collections",
      icon: {
        default: "material-symbols--collections-bookmark-outline",
        active: "material-symbols--collections-bookmark",
      },
      isAuthRequired: true,
      isShownOnMobile: false,
    },
    {
      id: 6,
      title: "История",
      href: "/history",
      icon: {
        default: "material-symbols--history",
        active: "material-symbols--history",
      },
      isAuthRequired: true,
      isShownOnMobile: false,
    },
  ];

  return (
    <>
      <header className="fixed bottom-0 left-0 z-50 w-full text-white bg-black rounded-t-lg sm:sticky sm:top-0 sm:rounded-t-none sm:rounded-b-lg">
        <div className={`container flex items-center min-h-[76px] justify-center ${preferenceStore.flags.showFifthButton && preferenceStore.flags.showNavbarTitles == "always" ? "gap-0" : "gap-4"} mx-auto sm:gap-0 sm:justify-between`}>
          <div className={`flex items-center ${preferenceStore.flags.showFifthButton && preferenceStore.flags.showNavbarTitles == "always" ? "gap-4" : "gap-8"} px-2 py-4 sm:gap-4`}>
            {menuItems.map((item) => {
              return (
                <Link
                  href={item.href}
                  key={`navbar__${item.id}`}
                  className={`flex-col items-center justify-center gap-1 lg:flex-row ${item.isAuthRequired && !userStore.isAuth ? "hidden"
                    : item.isShownOnMobile ? "flex"
                      : "hidden sm:flex"
                    } ${[item.href, item.hrefInCategory].includes("/" + pathname.split("/")[1]) ? "font-bold" : "font-medium"} transition-all`}
                >
                  <span
                    className={`w-6 h-6 iconify ${[item.href, item.hrefInCategory].includes("/" + pathname.split("/")[1]) ? item.icon.active : item.icon.default}`}
                  ></span>
                  <span
                    className={`text-xs sm:text-base ${preferenceStore.flags.showNavbarTitles == "always" || preferenceStore.flags.showNavbarTitles == "links" || (preferenceStore.flags.showNavbarTitles == "selected" && [item.href, item.hrefInCategory].includes("/" + pathname.split("/")[1])) ? "block" : "hidden"}`}
                  >
                    {item.title}
                  </span>
                </Link>
              );
            })}
          </div>
          <div className={`flex items-center ${preferenceStore.flags.showFifthButton && preferenceStore.flags.showNavbarTitles == "always" ? "gap-4" : "gap-8"} px-2 py-4 sm:gap-4`}>
            {!userStore.isAuth ?
              <Link
                href={
                  pathname != "/login" ? `/login?redirect=${pathname}` : "#"
                }
                className={`flex items-center flex-col lg:flex-row gap-1 ${pathname == "/login" ? "font-bold" : "font-medium"} transition-all`}
              >
                <span className="w-6 h-6 iconify material-symbols--login"></span>
                <span
                  className={`text-xs sm:text-base ${preferenceStore.flags.showNavbarTitles == "always" || (preferenceStore.flags.showNavbarTitles == "selected" && pathname == "/login") ? "block" : "hidden"}`}
                >
                  Войти
                </span>
              </Link>
              : <>
                <Link
                  href={`/profile/${userStore.user.id}`}
                  className={`hidden lg:flex flex-col lg:flex-row items-center gap-1 ${pathname == `/profile/${userStore.user.id}` ? "font-bold" : "font-medium"} transition-all`}
                >
                  <Image
                    src={userStore.user.avatar}
                    alt=""
                    className="w-6 h-6 rounded-full"
                    width={24}
                    height={24}
                  />
                  <span
                    className={`text-xs sm:text-base ${preferenceStore.flags.showNavbarTitles == "always" || preferenceStore.flags.showNavbarTitles == "links" || (preferenceStore.flags.showNavbarTitles == "selected" && pathname == `/profile/${userStore.user.id}`) ? "block" : "hidden"}`}
                  >
                    {userStore.user.login}
                  </span>
                </Link>
                {preferenceStore.flags.showFifthButton ?
                  <Link
                    href={menuItems[preferenceStore.flags.showFifthButton].href}
                    className={`flex flex-col sm:hidden items-center gap-1 ${pathname == menuItems[preferenceStore.flags.showFifthButton].href ? "font-bold" : "font-medium"} transition-all`}
                  >
                    <span
                      className={`w-6 h-6 iconify ${pathname == menuItems[preferenceStore.flags.showFifthButton].href ? menuItems[preferenceStore.flags.showFifthButton].icon.active : menuItems[preferenceStore.flags.showFifthButton].icon.default}`}
                    ></span>
                    <span
                      className={`text-xs sm:text-base ${preferenceStore.flags.showNavbarTitles == "always" || preferenceStore.flags.showNavbarTitles == "links" || (preferenceStore.flags.showNavbarTitles == "selected" && pathname == menuItems[preferenceStore.flags.showFifthButton].href) ? "block" : "hidden"}`}
                    >
                      {menuItems[preferenceStore.flags.showFifthButton].title}
                    </span>
                  </Link>
                  : ""}
                <Link
                  href={`/menu`}
                  className={`flex flex-col lg:hidden items-center gap-1 ${pathname == `/menu` || pathname == `/profile/${userStore.user.id}` ? "font-bold" : "font-medium"} transition-all`}
                >
                  <Image
                    src={userStore.user.avatar}
                    alt=""
                    className="w-6 h-6 rounded-full"
                    width={24}
                    height={24}
                  />
                  <span
                    className={`text-xs sm:text-base ${preferenceStore.flags.showNavbarTitles == "always" || preferenceStore.flags.showNavbarTitles == "links" || (preferenceStore.flags.showNavbarTitles == "selected" && (pathname == `/menu` || pathname == `/profile/${userStore.user.id}`)) ? "block" : "hidden"}`}
                  >
                    {userStore.user.login}
                  </span>
                </Link>
              </>
            }
            <button
              className={`${userStore.isAuth ? "hidden lg:flex" : "flex"} flex-col items-center gap-1 lg:flex-row`}
              onClick={() => setIsSettingModalOpen(true)}
            >
              <span className="w-6 h-6 iconify material-symbols--settings-outline-rounded"></span>
              <span
                className={`text-xs sm:text-base ${preferenceStore.flags.showNavbarTitles == "always" ? "block" : "hidden"}`}
              >
                Настройки
              </span>
            </button>
            {userStore.isAuth && (
              <button
                className="flex-col items-center hidden gap-1 lg:flex-row lg:flex"
                onClick={() => userStore.logout()}
              >
                <span className="w-6 h-6 iconify material-symbols--logout"></span>
                <span
                  className={`text-xs sm:text-base ${preferenceStore.flags.showNavbarTitles == "always" ? "lg:hidden xl:block" : "hidden"}`}
                >
                  Выйти
                </span>
              </button>
            )}
          </div>
        </div>
      </header>
      <SettingsModal
        isOpen={isSettingModalOpen}
        setIsOpen={setIsSettingModalOpen}
      />
    </>
  );
};
