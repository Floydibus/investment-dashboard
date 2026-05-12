import { DashboardLiveGate } from "@/components/dashboard/dashboard-live-gate";
import { TickerDashboard } from "@/components/dashboard/ticker-dashboard";
import { getAlphaVantageApiKey } from "@/lib/api/alpha-vantage";
import {
  getDashboardTickerParams,
  getDashboardViewModel,
} from "@/lib/data/dashboard-view-model";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ ticker: string }>;
};

export default async function DashboardPage({ params }: PageProps) {
  const { ticker } = await params;
  const decoded = decodeURIComponent(ticker);

  if (!getAlphaVantageApiKey()) {
    const model = await getDashboardViewModel(decoded);
    return <TickerDashboard model={model} />;
  }

  const { displayTicker, avSym } = getDashboardTickerParams(decoded);
  return <DashboardLiveGate displayTicker={displayTicker} avSym={avSym} />;
}
