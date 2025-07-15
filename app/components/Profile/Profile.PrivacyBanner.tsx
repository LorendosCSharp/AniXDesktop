export const ProfilePrivacyBanner = (props: {
  is_privacy: boolean;
  is_me_blocked: boolean;
}) => {
  return (
    <>
      {props.is_privacy && (
        <div
          className={`flex flex-col justify-between w-full p-4 border rounded-md md:flex-row ${
            !props.is_me_blocked
              ? "border-gray-200 bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
              : "border-red-200 bg-red-50 dark:bg-red-700 dark:border-red-600"
          }`}
        >
          <div className="mb-4 md:mb-0 md:me-4">
            <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-200">
              {!props.is_me_blocked
                ? "У пользователя установлены настройки приватности. Некоторая информация для вас может быть недоступна."
                : "Вы заблокированы данным пользователем. Его информация для вас не доступна."}
            </p>
          </div>
        </div>
      )}
    </>
  );
};
