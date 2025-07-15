"use client";

import { Avatar, Card, useThemeMode } from "flowbite-react";
import { UserRole } from "./Profile.Role";
import { UserSocial } from "./Profile.Social";
import Link from "next/link";

interface ProfileUserProps {
  avatar: string;
  login: string;
  status: string;
  rating: number;
  roles: {
    id: number;
    name: string;
    color: string;
  }[];
  isMyProfile: boolean;
  isSponsor: boolean;
  isBlocked: boolean;
  isVerified: boolean;
  isOnline: boolean;
  socials: {
    vk: string;
    tg: string;
    tt: string;
    inst: string;
    discord: string;
  };
  is_social_hidden: boolean;
}

export const ProfileUser = ({
  avatar,
  login,
  status,
  rating,
  roles,
  isMyProfile,
  isVerified,
  isOnline,
  isSponsor,
  isBlocked,
  socials,
  is_social_hidden,
}: ProfileUserProps) => {
  const theme = useThemeMode().mode;

  return (
    <Card>
      {(isMyProfile ||
        isVerified ||
        isSponsor ||
        isBlocked ||
        roles.length > 0) && (
        <div className="flex flex-wrap gap-2">
          {isMyProfile && <UserRole name="Мой профиль" color="3f83f8" />}
          {isBlocked && <UserRole name="Заблокирован" color="f56565" />}
          {isVerified && <UserRole name="Верифицирован" color="0e9f6e" />}
          {isSponsor && <UserRole name="Спонсор Anixart" color="ecc94b" />}
          {roles.map((role) => (
            <UserRole key={role.id} name={role.name} color={role.color} />
          ))}
        </div>
      )}
      <div className="flex flex-col items-center gap-4 sm:items-start sm:flex-row">
        <Avatar
          alt=""
          img={avatar}
          rounded={true}
          size={"lg"}
          bordered={true}
          color={isOnline ? "success" : "light"}
          className="flex-shrink-0"
        />
        <div className="flex flex-col gap-2">
          <p className="flex items-center gap-2 text-2xl font-semibold">
            {login}
            <span
              className={`border rounded-md px-2 py-1 min-w-8 text-sm flex items-center justify-center ${
                rating > 0 ?
                  "border-green-500 text-green-500"
                : "border-red-500 text-red-500"
              }`}
            >
              {rating}
            </span>
          </p>
          <p className="text-sm whitespace-pre-wrap sm:text-md">{status}</p>
        </div>
      </div>
      {!is_social_hidden &&
        (socials.vk ||
          socials.tg ||
          socials.discord ||
          socials.tt ||
          socials.inst) && (
          <div className="flex flex-wrap gap-2">
            {socials.vk && (
              <Link href={`https://vk.com/${socials.vk}`} target="_blank">
                <UserSocial
                  nickname={socials.vk}
                  icon="fa6-brands--vk"
                  url={`https://vk.com/${socials.vk}`}
                  color="4a76a8"
                />
              </Link>
            )}
            {socials.tg && (
              <Link href={`https://t.me/${socials.tg}`} target="_blank">
                <UserSocial
                  nickname={socials.tg}
                  icon="fa6-brands--telegram"
                  url={`https://t.me/${socials.tg}`}
                  color="2aabee"
                />
              </Link>
            )}
            {socials.tt && (
              <Link href={`https://tiktok.com/@${socials.tt}`} target="_blank">
                <UserSocial
                  nickname={socials.tt}
                  icon="fa6-brands--tiktok"
                  url={`https://tiktok.com/@${socials.tt}`}
                  color={theme == "light" ? "000000" : "ffffff"}
                />
              </Link>
            )}
            {socials.inst && (
              <Link
                href={`https://instagram.com/${socials.inst}`}
                target="_blank"
              >
                <UserSocial
                  nickname={socials.inst}
                  icon="fa6-brands--instagram"
                  url={`https://instagram.com/${socials.inst}`}
                  color="c32aa3"
                />
              </Link>
            )}
            {socials.discord && (
              <UserSocial
                nickname={socials.discord}
                icon="fa6-brands--discord"
                url={`https://discord.com/${socials.discord}`}
                color="5865f2"
              />
            )}
          </div>
        )}
    </Card>
  );
};
