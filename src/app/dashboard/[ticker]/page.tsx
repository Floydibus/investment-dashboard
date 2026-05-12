import { TickerDashboard } from "@/components/dashboard/ticker-dashboard";
import { getDashboardViewModel } from "@/lib/data/dashboard-view-model";

export const dynamic = "force-dynamic";
/** Vercel Pro+: längeres SSR für Alpha Vantage (Hobby bleibt bei ~10s Plafond). */
export const maxDuration = 60;

type PageProps = {  params: Promise<{ ticker: string }>;
};

export default async function DashboardPage({ params }: PageProps) {
  const { ticker } = await params;
  const decoded = decodeURIComponent(ticker);
  const model = await getDashboardViewModel(decoded);

  return <TickerDashboard model={model} />;
}
