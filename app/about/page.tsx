export const metadata = {
  title: "О приложении",
  openGraph: {
    title: "AniX - Неофициальный веб клиент для Anixart",
    description:
      "AniX - это неофициальный веб-клиент для Android-приложения Anixart. Он позволяет вам получать доступ к своей учетной записи Anixart и управлять ею из веб-браузера. Так-же можно синхронизировать и управлять списками и избранным. И самое главное смотреть все доступные аниме из базы Anixart.",
  },
};

export const dynamic = "force-static";

import { AboutPage } from "#/pages/About";

export default function Index() {
  return <AboutPage />;
}
