"use client";

import Link from "next/link";
import {
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
import { CurrentDate } from "@/components/dashboard/current-date";
import { TickerSearch } from "@/components/search/ticker-search";
import { useLocale } from "@/contexts/locale-context";
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
  const { t } = useLocale();

  const waitLine = (tk: string) =>
    t("dash.waitingTicker").replace(/\{ticker\}/g, tk);

  const news5 = useMemo(
    () => filterNewsByDays(model.news, 5),
    [model.news],
  );
  const news30 = useMemo(
    () => filterNewsByDays(model.news, 30),
    [model.news],
  );

  const positive = model.quote.changePercent >= 0;
  const live = model.marketDataState === "live";

  const analysisBanner =
    model.marketDataState === "no_api_key" ? (
      <p className="rounded-lg border border-amber-900/60 bg-amber-950/40 px-4 py-3 text-sm text-amber-100">
        {t("dash.bannerNoKey")}
      </p>
    ) : model.marketDataState === "unavailable" ? (
      <p className="rounded-lg border border-slate-700 bg-slate-900/80 px-4 py-3 text-sm text-slate-300">
        {t("dash.bannerUnavailable").replace(/\{ticker\}/g, model.ticker)}
      </p>
    ) : null;

  return (
    <div className="min-h-screen space-y-6 bg-slate-950 p-6 text-white">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-slate-500">
          <Link href="/" className="hover:text-slate-300">
            {t("dash.back")}
          </Link>
        </p>
        <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-6">
          <div className="w-full max-w-xl sm:max-w-md sm:flex-1">
            <TickerSearch />
          </div>
          <div className="shrink-0 text-right text-sm text-slate-400">
            <CurrentDate prefix="" className="inline-block" />
          </div>
        </div>
      </div>

      {analysisBanner}

      <header className="flex flex-col gap-4 border-b border-slate-800 pb-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 flex-1 flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
          <div className="min-w-0 shrink-0">
            <h1 className="text-3xl font-bold tracking-tight">
              {model.ticker} · {t("dash.analysis")}
            </h1>
            {live && model.companyName ? (
              <p className="mt-1 text-sm font-medium text-slate-300">{model.companyName}</p>
            ) : null}
            {live ? (
              <p className="mt-0.5 font-mono text-xs text-slate-600">
                {t("dash.dataSource")} {model.displaySymbol}
              </p>
            ) : (
              <p className="mt-2 text-sm text-slate-400">
                {waitLine(model.ticker)}
              </p>
            )}
          </div>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-1 sm:max-w-xs">
            <span className="sr-only">{t("dash.sparkSr")}</span>
            <div className="flex h-14 min-h-0 w-full items-center">
              <QuoteSparkline data={model.sparkline} positive={positive} live={live} />
            </div>
            {live && model.sparklineHint ? (
              <p className="text-[10px] leading-snug text-slate-500">{model.sparklineHint}</p>
            ) : null}
          </div>
        </div>
        <div className="shrink-0 text-left sm:text-right">
          {live ? (
            <>
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
                {model.quote.changePercent.toFixed(1)}% {t("dash.vsPrev")}
              </p>
            </>
          ) : (
            <p className="max-w-xs text-right text-sm text-slate-500">
              {waitLine(model.ticker)}
            </p>
          )}
        </div>
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card className="border-slate-800 bg-slate-900">
            <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
              <BarChart3 className="size-4 text-sky-400" aria-hidden />
              <CardTitle className="text-sm text-slate-400">{t("dash.priceData")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              {!live ? (
                <p className="text-slate-500">{waitLine(model.ticker)}</p>
              ) : (
                <>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">{t("dash.last")}</span>
                    <span className="font-mono text-white">
                      {model.quote.currency === "USD" ? "$" : `${model.quote.currency} `}
                      {model.quote.last.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-slate-500">{t("dash.prevClose")}</span>
                    <span className="font-mono text-slate-300">
                      {model.quote.currency === "USD" ? "$" : `${model.quote.currency} `}
                      {model.priceContext.previousClose.toFixed(2)}
                    </span>
                  </div>
                  {model.priceContext.sessionHigh != null &&
                  model.priceContext.sessionLow != null ? (
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">{t("dash.range")}</span>
                      <span className="text-right font-mono text-xs text-slate-300">
                        {model.quote.currency === "USD" ? "$" : `${model.quote.currency} `}
                        {model.priceContext.sessionLow.toFixed(2)} –{" "}
                        {model.priceContext.sessionHigh.toFixed(2)}
                      </span>
                    </div>
                  ) : null}
                  {model.priceContext.volumeMln != null ? (
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">{t("dash.volume")}</span>
                      <span className="font-mono text-slate-300">
                        {model.priceContext.volumeMln.toFixed(1)} {t("dash.volMio")}
                      </span>
                    </div>
                  ) : null}
                  {model.priceContext.marketCapBln != null ? (
                    <div className="flex justify-between gap-4">
                      <span className="text-slate-500">{t("dash.mcap")}</span>
                      <span className="font-mono text-slate-300">
                        ${model.priceContext.marketCapBln.toFixed(1)} {t("dash.mcapBln")}
                      </span>
                    </div>
                  ) : null}
                </>
              )}
            </CardContent>
          </Card>

          {live && (model.companyDescription || model.avSectorRaw) ? (
            <Card className="border-slate-800 bg-slate-900">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-slate-400">{t("dash.profile")}</CardTitle>
                {model.avSectorRaw ? (
                  <CardDescription className="font-mono text-xs text-slate-500">
                    {model.avSectorRaw}
                    {model.avIndustry ? ` · ${model.avIndustry}` : ""}
                  </CardDescription>
                ) : null}
              </CardHeader>
              <CardContent className="text-sm leading-relaxed text-slate-300">
                {model.companyDescription ? (
                  <p className="whitespace-pre-wrap">{model.companyDescription}</p>
                ) : (
                  <p className="text-slate-500">{t("dash.noDesc")}</p>
                )}
              </CardContent>
            </Card>
          ) : null}

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-sm text-slate-400">{t("dash.targets")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {!live ? (
                <p className="text-sm text-slate-500">{waitLine(model.ticker)}</p>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {model.analystConsensusUsd != null ? (
                      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                        <p className="text-xs text-slate-500">{t("dash.analystOverview")}</p>
                        <p className="mt-1 font-mono text-lg font-semibold text-white">
                          ${model.analystConsensusUsd.toFixed(2)}
                        </p>
                      </div>
                    ) : (
                      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3 sm:col-span-2">
                        <p className="text-xs text-slate-500">{t("dash.analyst")}</p>
                        <p className="mt-1 text-sm text-slate-400">{t("dash.noAnalystTarget")}</p>
                      </div>
                    )}
                    {model.analystConsensusHighUsd != null ? (
                      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                        <p className="text-xs text-slate-500">{t("dash.analystHigh")}</p>
                        <p className="mt-1 font-mono text-lg font-semibold text-white">
                          ${model.analystConsensusHighUsd.toFixed(2)}
                        </p>
                      </div>
                    ) : null}
                    {model.fairValueUsd != null ? (
                      <div className="rounded-lg border border-slate-800 bg-slate-950/60 p-3">
                        <p className="text-xs text-slate-500">{t("dash.fairValue")}</p>
                        <p className="mt-1 font-mono text-lg font-semibold text-emerald-300">
                          ${model.fairValueUsd.toFixed(2)}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </>
              )}
              {model.keyStats.length > 0 ? (
                <div className="grid gap-2 sm:grid-cols-2">
                  {model.keyStats.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between gap-3 rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm"
                    >
                      <span className="text-slate-500">{row.label}</span>
                      <span className="text-right font-mono text-slate-100">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>

          <Card className="border-slate-800 bg-slate-900">
            <CardHeader>
              <CardTitle className="text-sm text-slate-400">{t("dash.institutional")}</CardTitle>
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
                <CardTitle className="text-lg">{t("dash.news")}</CardTitle>
                <TabsList className="bg-slate-800">
                  <TabsTrigger value="5d">{t("dash.tab5")}</TabsTrigger>
                  <TabsTrigger value="30d">{t("dash.tab30")}</TabsTrigger>
                </TabsList>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <TabsContent value="5d" className="mt-0 space-y-4">
                {news5.length === 0 ? (
                  <p className="text-sm text-slate-500">{t("dash.noNews")}</p>
                ) : (
                  news5.map((n) => (
                    <NewsRow key={n.id} article={n} />
                  ))
                )}
              </TabsContent>
              <TabsContent value="30d" className="mt-0 space-y-4">
                {news30.length === 0 ? (
                  <p className="text-sm text-slate-500">{t("dash.noNews")}</p>
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
                {model.strategicSectionTitles.construction}
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
                {model.strategicSectionTitles.tech}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">{model.strategic.tech}</CardContent>
          </Card>

          <Card className="border-l-4 border-l-emerald-500 border-slate-700 bg-slate-900">
            <CardHeader className="flex flex-row items-center space-x-2 space-y-0">
              <Handshake className="text-emerald-500" aria-hidden />
              <CardTitle className="text-sm uppercase">
                {model.strategicSectionTitles.contracts}
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
            {t("dash.research")}
            <span className="rounded-md border border-slate-700 bg-slate-800/80 px-2 py-0.5 text-xs font-normal text-slate-300">
              {model.aiSummary.sectorLabelDe}
            </span>
          </CardTitle>
          <CardDescription className="text-slate-400">
            {model.aiSummary.headline}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-slate-300">
          <SummaryBlock title={t("dash.thesis")} body={model.aiSummary.investmentThesis} />
          <SummaryBlock
            title={t("dash.ops")}
            body={model.aiSummary.operationsCapacityNarrative}
          />
          <SummaryBlock
            title={t("dash.tech")}
            body={model.aiSummary.technologyInnovationNarrative}
          />
          <SummaryBlock
            title={t("dash.commercial")}
            body={model.aiSummary.contractsCommercialNarrative}
          />
          <SummaryBlock
            title={t("dash.risks")}
            body={model.aiSummary.risksCatalystsAndConclusion}
          />
        </CardContent>
      </Card>
    </div>
  );
}

function NewsRow({ article }: { article: NewsArticle }) {
  const { locale } = useLocale();
  const locTag = locale === "en" ? "en-US" : "de-DE";
  return (
    <div className="border-l-2 border-blue-500 bg-slate-800/50 p-3 text-sm">
      <p className="text-slate-100">{article.headline}</p>
      <p className="mt-1 text-xs text-slate-500">
        {article.source} ·{" "}
        {new Date(article.datetime).toLocaleDateString(locTag, {
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
  live,
}: {
  data: DashboardSparkPoint[];
  positive: boolean;
  live: boolean;
}) {
  const { t } = useLocale();
  const rawId = useId().replace(/:/g, "");
  const gradId = `spark-fill-${rawId}`;
  const stroke = positive ? "#4ade80" : "#f87171";

  if (!live || data.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center rounded-md border border-dashed border-slate-700 text-xs text-slate-600">
        {!live ? t("dash.sparkWait") : t("dash.sparkEmpty")}
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
