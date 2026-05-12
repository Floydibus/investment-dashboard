"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { TickerDashboard } from "@/components/dashboard/ticker-dashboard";
import type { CompanyOverview, QuoteSnapshot } from "@/lib/api/alpha-vantage";
import type { DashboardViewModel } from "@/lib/data/dashboard-view-model";
import {
  buildDashboardViewModelFromBundle,
  getDashboardShellFor,
} from "@/lib/data/dashboard-view-model";

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

type Props = {
  displayTicker: string;
  avSym: string;
};

/**
 * Lädt Quote → Daily → Overview in **getrennten** API-Requests (je 1 Alpha-Vantage-Call),
 * damit Vercel Hobby (~10s pro Serverless) nicht abbricht; UI aktualisiert sich progressiv.
 */
export function DashboardLiveGate({ displayTicker, avSym }: Props) {
  const [model, setModel] = useState<DashboardViewModel | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setModel(null);
      try {
        const qRes = await fetch(
          `/api/stock/quote?ticker=${encodeURIComponent(avSym)}`,
        );
        const qJson = (await qRes.json()) as {
          ok?: boolean;
          quote?: QuoteSnapshot;
        };
        if (cancelled) return;
        if (!qJson.ok || !qJson.quote) {
          setModel(getDashboardShellFor(displayTicker, avSym, "unavailable"));
          return;
        }
        const quote = qJson.quote;

        setModel(
          buildDashboardViewModelFromBundle(displayTicker, avSym, quote, [], null),
        );

        await sleep(600);
        if (cancelled) return;
        const dRes = await fetch(
          `/api/stock/daily?ticker=${encodeURIComponent(avSym)}`,
        );
        const dJson = (await dRes.json()) as {
          ok?: boolean;
          dailyCloses?: { date: string; close: number }[];
        };
        const daily = Array.isArray(dJson.dailyCloses) ? dJson.dailyCloses : [];
        if (!cancelled) {
          setModel(
            buildDashboardViewModelFromBundle(displayTicker, avSym, quote, daily, null),
          );
        }

        await sleep(600);
        if (cancelled) return;
        const oRes = await fetch(
          `/api/stock/overview?ticker=${encodeURIComponent(avSym)}`,
        );
        const oJson = (await oRes.json()) as {
          ok?: boolean;
          overview?: CompanyOverview | null;
        };
        const overview = oJson.ok ? (oJson.overview ?? null) : null;
        if (!cancelled) {
          setModel(
            buildDashboardViewModelFromBundle(
              displayTicker,
              avSym,
              quote,
              daily,
              overview,
            ),
          );
        }
      } catch {
        if (!cancelled) {
          setModel(getDashboardShellFor(displayTicker, avSym, "unavailable"));
        }
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
  }, [displayTicker, avSym]);

  if (!model) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center gap-4 bg-slate-950 p-8 text-slate-300">
        <Loader2 className="size-10 animate-spin text-sky-400" aria-hidden />
        <p className="max-w-md text-center text-sm">
          Marktdaten werden geladen... bitte kurz warten.
        </p>
      </div>
    );
  }

  return <TickerDashboard model={model} />;
}
