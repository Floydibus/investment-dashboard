"use client";

import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocale } from "@/contexts/locale-context";
import type { AppLocale } from "@/lib/i18n/app-locale";

export function LanguagePickerModal() {
  const {
    languageModalOpen,
    setLocale,
    t,
  } = useLocale();

  if (!languageModalOpen) return null;

  function pick(l: AppLocale) {
    setLocale(l);
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-picker-title"
    >
      <Card className="w-full max-w-md border-border bg-card shadow-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
            <Languages className="size-6 text-accent" aria-hidden />
          </div>
          <CardTitle id="lang-picker-title" className="text-xl">
            {t("lang.title")}
          </CardTitle>
          <CardDescription className="text-base">
            {t("lang.subtitle")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button
            type="button"
            size="lg"
            className="flex-1"
            variant="default"
            onClick={() => pick("de")}
          >
            {t("lang.chooseDe")}
          </Button>
          <Button
            type="button"
            size="lg"
            className="flex-1"
            variant="secondary"
            onClick={() => pick("en")}
          >
            {t("lang.chooseEn")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

/** Feste Ecke: Sprache später ändern */
export function LanguageFloatingButton() {
  const { openLanguageModal, t, languageModalOpen } = useLocale();
  if (languageModalOpen) return null;
  return (
    <button
      type="button"
      onClick={openLanguageModal}
      className="fixed bottom-4 right-4 z-[150] flex items-center gap-2 rounded-full border border-border bg-card/95 px-4 py-2 text-sm font-medium shadow-lg backdrop-blur-md transition-colors hover:bg-muted"
      aria-label={t("lang.change")}
    >
      <Languages className="size-4" aria-hidden />
      {t("lang.change")}
    </button>
  );
}
