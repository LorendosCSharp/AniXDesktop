import "./globals.css";
import { App } from "./App";
import { ThemeModeScript } from "flowbite-react";
import { PublicEnvScript } from 'next-runtime-env';

export const metadata = {
  keywords: ["anix", "anixart", "anime", "аниксарт", "аниме"],
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  title: {
    template: "AniXDesktop | %s",
    default: "AniXDesktop | Домашняя",
  },
  description: "Неофициальное приложение для anixart.tv",

  openGraph: {
    images: [
      {
        url: "/opengraph.png", // Must be an absolute URL
        width: 400,
        height: 600,
      },
    ],
    locale: "ru_RU",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <PublicEnvScript />
        <ThemeModeScript />
      </head>
      <App>{children}</App>
    </html>
  );
}
