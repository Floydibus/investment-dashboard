import { DashboardLiveGate } from "@/components/dashboard/dashboard-live-gate";
import { TickerDashboard } from "@/components/dashboard/ticker-dashboard";
import { getAlphaVantageApiKey } from "@/lib/api/alpha-vantage";
import {
  getDashboardTickerParams,
  getDashboardViewModel,
} from "@/lib/data/dashboard-view-model";
import { readServerLocale } from "@/lib/i18n/read-server-locale";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ ticker: string }>;
};

export default async function DashboardPage({ params }: PageProps) {
  const { ticker } = await params;
  const decoded = decodeURIComponent(ticker);

  if (!getAlphaVantageApiKey()) {
    const locale = await readServerLocale();
    const model = await getDashboardViewModel(decoded, locale);
    return <TickerDashboard model={model} />;
  }

  const { displayTicker, avSym } = getDashboardTickerParams(decoded);
  return (
    <DashboardLiveGate
      key={`${displayTicker}-${avSym}`}
      displayTicker={displayTicker}
      avSym={avSym}
    />
  );
}
