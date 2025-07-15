import { unixToDate } from "#/api/utils";

export const ProfileBannedBanner = (props: {
  is_banned: boolean;
  is_perm_banned: boolean;
  ban_reason: string;
  ban_expires: number;
}) => {
  return (
    <>
      {(props.is_banned || props.is_perm_banned) && (
        <div className="flex flex-col justify-between w-full p-4 border border-red-200 rounded-md md:flex-row bg-red-50 dark:bg-red-700 dark:border-red-600">
          <div className="mb-4 md:mb-0 md:me-4">
            <h2 className="mb-1 text-base font-semibold text-gray-900 dark:text-white">
              {props.is_perm_banned
                ? "Пользователь был заблокирован администрацией навсегда"
                : `Пользователь был заблокирован администрацией до
              ${unixToDate(props.ban_expires, "full")}`}
            </h2>
            <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-200">
              {props.ban_reason}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
