import Link from "next/link";
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

const modules = [
  {
    title: "Kurse & Veränderung",
    description: "GLOBAL_QUOTE + OVERVIEW + Tages-Serie — serverseitig, Key in .env.local.",
    icon: BarChart3,
  },
  {
    title: "News-Feed",
    description: "Optional — noch nicht mit Feed verbunden.",
    icon: Newspaper,
  },
  {
    title: "Strategische Insights",
    description: "Sektor-Templates: Tech, Finance, Energy u. a. — keine ticker-spezifischen Texte.",
    icon: Radar,
  },
  {
    title: "Analysten & Flows",
    description: "Analystenziel aus Overview, falls geliefert.",
    icon: Target,
  },
] as const;

export default function HomePage() {
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
          <CurrentDate prefix="" />
        </div>
        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
            Investment Intelligence
          </p>
          <h1 className="mt-4 text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Jede Aktie.{" "}
            <span className="bg-gradient-to-r from-accent to-teal-200/90 bg-clip-text text-transparent">
              Alle Daten. In Echtzeit.
            </span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
            Globale Marktanalyse: Ticker eingeben (z. B.{" "}
            <span className="font-mono text-foreground">AAPL</span>,{" "}
            <span className="font-mono text-foreground">TSLA</span>,{" "}
            <span className="font-mono text-foreground">ROG.SW</span>) — Kurs und Firmenprofil
            kommen von Alpha Vantage, sofern API-Key gesetzt ist.
          </p>
        </header>

        <section className="mx-auto flex w-full max-w-2xl flex-col items-center gap-3">
          <TickerSearch />
          <p className="text-center text-xs text-muted-foreground">
            Tipp: Vorschläge von Alpha Vantage · beliebigen Ticker per{" "}
            <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd>{" "}
            öffnen
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          {modules.map((m) => (
            <Card
              key={m.title}
              className="border-border/80 bg-card/60 backdrop-blur-sm transition-colors hover:border-accent/30"
            >
              <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-muted/50">
                  <m.icon className="size-5 text-accent" aria-hidden />
                </span>
                <div>
                  <CardTitle className="text-base">{m.title}</CardTitle>
                  <CardDescription className="mt-1.5 text-xs sm:text-sm">
                    {m.description}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/80">
                  Modul · Dashboard
                </span>
              </CardContent>
            </Card>
          ))}
        </section>

        <footer className="border-t border-border/60 pt-10 text-center text-xs text-muted-foreground">
          <p>
            Next.js App Router · Tailwind ·{" "}
            <Link
              href="/dashboard/AAPL"
              className="text-accent underline-offset-4 hover:underline"
            >
              Demo mit AAPL öffnen
            </Link>
          </p>
        </footer>
      </div>
    </div>
  );
}
