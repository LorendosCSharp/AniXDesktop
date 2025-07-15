import { sinceUnixDate } from "#/api/utils";
import { Chip } from "../Chip/Chip";

interface ChipProps {
  settings?: any;
  grade?: any;
  status?: any;
  status_id?: any;
  user_list?: any;
  episodes_released?: any;
  episodes_total?: any;
  category?: any;
  is_favorite?: any;
  last_view_episode?: any;
  last_view_timestamp?: any;
}

export const ReleaseChips = ({
  settings,
  grade,
  status,
  status_id,
  user_list,
  episodes_released,
  episodes_total,
  category,
  is_favorite,
  last_view_episode,
  last_view_timestamp,
}: ChipProps) => {
  const chipSettings = {
    enabled: true,
    gradeHidden: false,
    statusHidden: false,
    categoryHidden: false,
    episodesHidden: false,
    listHidden: false,
    favHidden: false,
    lastWatchedHidden: true,
    ...settings,
  };

  return (
    <div className={`${chipSettings.enabled ? "flex" : "hidden"} gap-1 flex-wrap`}>
      {!chipSettings.gradeHidden && grade ?
        <Chip
          className="w-12"
          bg_color={
            grade == 0 ? "hidden"
            : grade < 2 ?
              "bg-red-500"
            : grade < 3 ?
              "bg-orange-500"
            : grade < 4 ?
              "bg-yellow-500"
            : "bg-green-500"
          }
          name={`${grade}`}
        />
      : ""}
      {!chipSettings.listHidden && user_list && (
        <Chip bg_color={user_list.bg_color} name={user_list.name} />
      )}
      {!chipSettings.statusHidden && status ?
        <Chip name={status.name} />
      : status_id != 0 && (
          <Chip
            name={
              status_id == 1 ? "Завершено"
              : status_id == 2 ?
                "Онгоинг"
              : status_id == 3 && "Анонс"
            }
          />
        )
      }
      {!chipSettings.episodesHidden && (
        <Chip
          name={episodes_released && episodes_released}
          name_2={episodes_total ? episodes_total + " эп." : "? эп."}
          devider="/"
        />
      )}
      {!chipSettings.categoryHidden && category && <Chip name={category.name} />}
      {!chipSettings.favHidden && is_favorite && (
        <div className="flex items-center justify-center bg-pink-500 rounded-sm">
          <span className="w-3 px-4 py-2.5 text-white sm:px-4 sm:py-3 xl:px-6 xl:py-4 iconify mdi--heart"></span>
        </div>
      )}
      {!chipSettings.lastWatchedHidden && last_view_episode && (
        <Chip
          name={
            last_view_episode.name ?
              last_view_episode.name
            : `${last_view_episode.position + 1} серия`
          }
          name_2={last_view_timestamp && sinceUnixDate(last_view_timestamp)}
          devider=", "
        />
      )}
    </div>
  );
};
