"use client";

import Link from "next/link";
import {
  Activity,
  BarChart3,
  Construction,
  Handshake,
  MoveDownLeft,
  MoveUpRight,
  Rocket,
  Sparkles,
} from "lucide-react";
import { useId, useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type {
  DashboardSparkPoint,
  DashboardViewModel,
} from "@/lib/data/dashboard-view-model";
import type { NewsArticle } from "@/lib/api/finnhub";
import { cn } from "@/lib/utils";

function filterNewsByDays(articles: NewsArticle[], days: number): NewsArticle[] {
  const end = Date.now();
  const start = end - days * 86400000;
  return articles
    .filter((a) => {
      const t = new Date(a.datetime).getTime();
      return t >= start && t <= end;
    })
    .sort((a, b) => new Date(b.datetime).getTime() - new Date(a.datetime).getTime());
}

export type TickerDashboardProps = {
  model: DashboardViewModel;
};

function SummaryBlock({ title, body }: { title: string; body: string }) {
  return (
    <section>
      <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-slate-500">
        {title}
      </h3>
      <p className="text-slate-300">{body}</p>
    </section>
  );
}

export function TickerDashboard({ model }: TickerDashboardProps) {
  const [tab, setTab] = useState<"5d" | "30d">("5d");

  const news5 = useMemo(
    () => filterNewsByDays(model.news, 5),
    [model.news],
  );
  const news30 = useMemo(
    () => filterNewsByDays(model.news, 30),
    [model.news],
  );

  const positive = model.quote.changePercent >= 0;

  return (
    <div className="min-h-screen space-y-6 bg-slate-950 p-6 text-white">
      <p className="text-sm text-slate-500">
        <Link href="/" className="hover:text-slate-300">
          ← Zurück
        </Link>
      </p>

      <header className="flex flex-col gap-4 border-b border-slate-800 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <div className="min-w-0 shrink-0">
            <h1 className="text-3xl font-bold tracking-tight">
              {model.ticker} Dashboard
            </h1>
            <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
              <Activity className="size-3.5" aria-hidden />
              Stand:{" "}
              {new Date(model.quote.asOfDate).toLocaleDateString("de-DE", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
          <div className="flex h-14 min-w-0 flex-1 items-center gap-2 sm:max-w-xs">
            <span className="sr-only">Kursverlauf (14 Tage)</span>
            <QuoteSparkline data={model.sparkline} positive={positive} />
          </div>
        </div>
        <div className="shrink-0 text-left sm:text-right">
          <p className="font-mono text-2xl">
            {model.quote.currency === "USD" ? "$" : `${model.quote.currency} `}
            {model.quote.last.toFixed(2)}
          </p>
          <p
            className={cn(
              "flex items-center gap-1 text-sm sm:justify-end",
              positive ? "text-green-400" : "text-red-400",
            )}
          >
            {positive ? (
              <MoveUpRight size={14} aria-hidden />
            ) : (
              <MoveDownLeft size={14} aria-hidden />
            )}
            {positive ? "+" : ""}
            {model.quote.changePercent.toFixed(1)}% (vs. Vortag)
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <BarChart3 className="size-4 text-sky-400" aria-hidden />
              <CardTitle className="text-sm text-slate-400">
                Kurs-Daten
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Letzter Kurs</span>
                <span className="font-mono text-white">
                  {model.quote.currency === "USD" ? "$" : `${model.quote.currency} `}
                  {model.quote.last.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-500">Schluss Vortag</span>
                <span className="font-mono text-slate-300">
                  {model.quote.currency === "USD" ? "$" : `${model.quote.currency} `}
                  {model.priceContext.previousClose.toFixed(2)}
                </span>
              </div>
              {model.priceContext.sessionHigh != null &&
              model.priceContext.sessionLow != null ? (
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Tagesrange</span>
                  <span className="text-right font-mono text-xs text-slate-300">
                    {model.quote.currency === "USD" ? "$" : `${model.quote.currency} `}
                    {model.priceContext.sessionLow.toFixed(2)} –{" "}
                    {model.priceContext.sessionHigh.toFixed(2)}
                  </span>
                </div>
              ) : null}
              {model.priceContext.volumeMln != null ? (
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Volumen</span>
                  <span className="font-mono text-slate-300">
                    {model.priceContext.volumeMln.toFixed(1)} Mio.
                  </span>
                </div>
              ) : null}
              {model.priceContext.marketCapBln != null ? (
                <div className="flex justify-between gap-4">
                  <span className="text-slate-500">Marktkap.</span>
                  <span className="font-mono text-slate-300">
                    ${model.priceContext.marketCapBln.toFixed(1)} Mrd.
                  </span>
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-sm text-slate-400">
                Analysten-Kursziele
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                ${model.analystConsensusUsd.toFixed(2)}
              </div>
              <p className="text-xs text-slate-500">Konsensus-Target (Avg)</p>
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-sm text-slate-400">
                Institutionelle Trends
              </CardTitle>
            </CardHeader>
            <CardContent
              className={cn(
                model.institutionalPositive
                  ? "text-green-400"
                  : "text-slate-400",
              )}
            >
              {model.institutionalLabel}
            </CardContent>
          </Card>
        </div>

        <Card className="min-w-0 border-slate-800 bg-slate-900">
          <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as "5d" | "30d")}
            className="w-full"
          >
            <CardHeader className="space-y-0 pb-2">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-lg">News & Signale</CardTitle>
                <TabsList className="bg-slate-800">
                  <TabsTrigger value="5d">5 Tage</TabsTrigger>
                  <TabsTrigger value="30d">30 Tage</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <TabsContent value="5d" className="mt-0 space-y-4">
                {news5.length === 0 ? (
                  <p className="text-sm text-slate-500">Keine Meldungen im Fenster.</p>
                ) : (
                  news5.map((n) => (
                    <NewsRow key={n.id} article={n} />
                  ))
                )}
              </TabsContent>
              <TabsContent value="30d" className="mt-0 space-y-4">
                {news30.length === 0 ? (
                  <p className="text-sm text-slate-500">Keine Meldungen im Fenster.</p>
                ) : (
                  news30.map((n) => (
                    <NewsRow key={n.id} article={n} />
                  ))
                )}
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>

        <div className="min-w-0 space-y-6">
          <Card className="border-l-4 border-l-orange-500 border-slate-700 bg-slate-900">
            <CardHeader className="flex flex-row items-center space-x-2 space-y-0">
              <Construction className="text-orange-500" aria-hidden />
              <CardTitle className="text-sm uppercase">
                Baufortschritte / Kapazität
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {model.strategic.construction}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-purple-500 border-slate-700 bg-slate-900">
            <CardHeader className="flex flex-row items-center space-x-2 space-y-0">
              <Rocket className="text-purple-500" aria-hidden />
              <CardTitle className="text-sm uppercase">
                Technologiesprünge
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">{model.strategic.tech}</CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 border-slate-700 bg-slate-900">
            <CardHeader className="flex flex-row items-center space-x-2 space-y-0">
              <Handshake className="text-emerald-500" aria-hidden />
              <CardTitle className="text-sm uppercase">
                Verträge / Partnerschaften
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              {model.strategic.contracts}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-slate-800 bg-slate-900/80">
        <CardHeader>
          <CardTitle className="flex flex-wrap items-center gap-2 text-base text-white">
            <Sparkles className="size-4 text-teal-400" aria-hidden />
            Research-Zusammenfassung
            <span className="rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-xs font-normal text-slate-300">
              {model.aiSummary.sectorLabelDe}
            </span>
          </CardTitle>
          <CardDescription className="text-slate-400">
            {model.aiSummary.headline}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-slate-300">
          <SummaryBlock title="Investment-These" body={model.aiSummary.investmentThesis} />
          <SummaryBlock
            title="Operative Expansion & Kapazität"
            body={model.aiSummary.operationsCapacityNarrative}
          />
          <SummaryBlock
            title="Technologie & Innovation"
            body={model.aiSummary.technologyInnovationNarrative}
          />
          <SummaryBlock
            title="Kommerzialisierung & Partnerschaften"
            body={model.aiSummary.contractsCommercialNarrative}
          />
          <SummaryBlock
            title="Risiken, Katalysatoren & Fazit"
            body={model.aiSummary.risksCatalystsAndConclusion}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function NewsRow({ article }: { article: NewsArticle }) {
  return (
    <div className="border-l-2 border-blue-500 bg-slate-800/50 p-3 text-sm">
      <p className="text-slate-100">{article.headline}</p>
      <p className="mt-1 text-xs text-slate-500">
        {article.source} ·{" "}
        {new Date(article.datetime).toLocaleDateString("de-DE", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </p>
    </div>
  );
}

function QuoteSparkline({
  data,
  positive,
}: {
  data: DashboardSparkPoint[];
  positive: boolean;
}) {
  const rawId = useId().replace(/:/g, "");
  const gradId = `spark-fill-${rawId}`;
  const stroke = positive ? "#4ade80" : "#f87171";

  if (data.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-slate-700 text-xs text-slate-600">
        Keine Serienpunkte
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.35} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="close"
          stroke={stroke}
          fill={`url(#${gradId})`}
          strokeWidth={2}
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
