"use server";

import { Card } from "flowbite-react";
import Image from "next/image";

import * as fs from "node:fs";
import * as path from "node:path";
import { CURRENT_APP_VERSION } from "#/api/config";
import Styles from "../components/ChangelogModal/ChangelogModal.module.css";
import Markdown from "markdown-to-jsx";

import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";
import Link from "next/link";

export const AboutPage = async () => {
  const directoryPath = path.join(process.cwd(), "public/changelog");
  const files = fs.readdirSync(directoryPath);

  const current = {
    version: CURRENT_APP_VERSION,
    changelog: `#${CURRENT_APP_VERSION}\r\nНет списка изменений`,
  };

  const previous: { version: string; changelog: string }[] = [];

  if (files.includes(`${CURRENT_APP_VERSION}.md`)) {
    const changelog = fs.readFileSync(
      path.join(directoryPath, `${CURRENT_APP_VERSION}.md`),
      "utf8"
    );
    current.changelog = changelog;
  }

  files.forEach((file) => {
    if (file !== `${CURRENT_APP_VERSION}.md`) {
      const changelog = fs.readFileSync(path.join(directoryPath, file), "utf8");
      previous.push({
        version: file.replace(".md", ""),
        changelog: changelog,
      });
    }
  });

  return (
    <div className="grid grid-cols-1 gap-2 mb-4 md:grid-cols-2">
      <Card className="md:col-span-2">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <Image
            src="/images/icons/icon-512x512.png"
            className="flex-shrink-0 w-32 h-32 rounded-full"
            alt="about image"
            width={128}
            height={128}
          />
          <div>
            <h1 className="text-xl font-bold">
              AniXDesktop - Неофициальный десктоп-клиент для Anixart
            </h1>
            <p className="max-w-[900px]">
              AniXDesktop - это форк неофициального веб-клиента для сервиса Anixart под капотом
              десктопного приложения. Он предоставляет удобный способ просматривать, искать и
              управлять аниме-контентом прямо с вашего компьютера. Поддерживает авторизацию через
              аккаунт Anixart, синхронизацию избранного и коллекций, а также полноценный просмотр
              контента в комфортной оболочке. Не забудьте глянуть оригинальный репозиторий.
            </p>
          </div>
        </div>
      </Card>

      <Link href="https://github.com/LorendosCSharp/AniXDesktop" target="_blank">
        <Card>
          <div className="flex items-center gap-4">
            <span className="flex-shrink-0 w-16 h-16 iconify fa6-brands--github text-[#001725] dark:text-[#faf8f9]"></span>
            <div>
              <h1 className="text-xl font-bold">Код на GitHub</h1>
              <p className="text-sm text-gray-500 dark:text-gray-200">
                github.com/Radiquum/AniX
              </p>
            </div>
          </div>
        </Card>
      </Link>

      <Link href="https://github.com/Radiquum/AniX" target="_blank">
        <Card>
          <div className="flex items-center gap-4">
            <span className="flex-shrink-0 w-16 h-16 iconify fa6-brands--github text-[#001725] dark:text-[#faf8f9]"></span>
            <div>
              <h1 className="text-xl font-bold">Код на GitHub</h1>
              <p className="text-sm text-gray-500 dark:text-gray-200">
                github.com/Radiquum/AniX
              </p>
            </div>
          </div>
        </Card>
      </Link>

      <Card className="md:col-span-2">
        <h1 className="text-2xl font-bold">Список изменений</h1>
        <Markdown className={Styles.markdown}>{current.changelog}</Markdown>
        <Accordion collapseAll={true}>
          {previous.reverse().map((changelog) => (
            <AccordionPanel key={changelog.version}>
              <AccordionTitle>v{changelog.version}</AccordionTitle>
              <AccordionContent>
                <Markdown className={Styles.markdown}>{changelog.changelog}</Markdown>
              </AccordionContent>
            </AccordionPanel>
          ))}
        </Accordion>
      </Card>
    </div>
  );
};

