"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BarChart3, Newspaper, Radar, Target } from "lucide-react";
import { CurrentDate } from "@/components/dashboard/current-date";
import { TickerSearch } from "@/components/search/ticker-search";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLocale } from "@/contexts/locale-context";

export function HomeContent() {
  const { t } = useLocale();

  const modules = useMemo(
    () =>
      [
        { titleKey: "mod1.title" as const, descKey: "mod1.desc" as const, icon: BarChart3 },
        { titleKey: "mod2.title" as const, descKey: "mod2.desc" as const, icon: Newspaper },
        { titleKey: "mod3.title" as const, descKey: "mod3.desc" as const, icon: Radar },
        { titleKey: "mod4.title" as const, descKey: "mod4.desc" as const, icon: Target },
      ] as const,
    [],
  );

  return (
    <div className="relative min-h-dvh overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 bg-[size:48px_48px] bg-grid-fade opacity-[0.35]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-40 top-0 h-[420px] w-[420px] rounded-full bg-accent/15 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-0 right-[-120px] h-[380px] w-[480px] rounded-full bg-primary/10 blur-3xl"
        aria-hidden
      />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-24 pt-16 sm:px-6 lg:pt-24">
        <div className="flex justify-end text-sm text-muted-foreground">
          <CurrentDate prefix="" className="inline-block" />
        </div>
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            {t("home.badge")}
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            {t("home.hero1")}{" "}
            <span className="bg-gradient-to-r from-accent to-teal-200/90 bg-clip-text text-transparent">
              {t("home.hero2")}
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            {t("home.sub")}
          </p>
        </header>

        <section className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3">
          <TickerSearch />
          <p className="text-center text-xs text-muted-foreground">{t("home.tip")}</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {modules.map((m) => (
            <Card
              key={m.titleKey}
              className="border-border/80 bg-card/60 backdrop-blur-sm transition-colors hover:border-accent/30"
            >
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted/50">
                  <m.icon className="size-5 text-accent" aria-hidden />
                </span>
                <div>
                  <CardTitle className="text-base">{t(m.titleKey)}</CardTitle>
                  <CardDescription className="mt-1.5 text-xs sm:text-sm">
                    {t(m.descKey)}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
                  {t("home.moduleLabel")}
                </span>
              </CardContent>
            </Card>
          ))}
        </section>

        <footer className="border-t border-border/60 pt-10 text-center text-xs text-muted-foreground">
          <p>
            {t("home.footer")} ·{" "}
            <Link
              href="/dashboard/AAPL"
              className="text-accent underline-offset-4 hover:underline"
            >
              {t("home.demo")}
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
