/** Kern-Sektoren für Marktanalyse-Templates (Alpha Vantage + Fallback). */
export type DashboardSectorKey =
  | "tech"
  | "general"
  | "energy"
  | "finance"
  | "consumer"
  | "industrial";

export const SECTOR_LABEL_DE: Record<DashboardSectorKey, string> = {
  tech: "Technologie (Software, Halbleiter & digitale Infrastruktur)",
  general: "Diversifiziert / sonstige Branche",
  energy: "Energy (Öl, Gas, erneuerbare Energien & Infrastruktur)",
  finance: "Finanzdienstleistungen (Banken, Versicherungen & Kapitalmärkte)",
  consumer: "Konsum & Handel (FMCG, Einzelhandel & Logistik)",
  industrial: "Industrie & Infrastruktur (Automation, Bau & schwere Güter)",
};

const TICKER_SECTOR_MAP: Record<string, DashboardSectorKey> = {
  AAPL: "tech",
  MSFT: "tech",
  GOOGL: "tech",
  GOOG: "tech",
  META: "tech",
  NVDA: "tech",
  AMD: "tech",
  INTC: "tech",
  AVGO: "tech",
  CRM: "tech",
  ORCL: "tech",
  SAP: "tech",
  ASML: "tech",
  TSLA: "tech",
  XOM: "energy",
  CVX: "energy",
  COP: "energy",
  SHEL: "energy",
  BP: "energy",
  TTE: "energy",
  JPM: "finance",
  BAC: "finance",
  WFC: "finance",
  GS: "finance",
  MS: "finance",
  V: "finance",
  MA: "finance",
  NESN: "consumer",
  KO: "consumer",
  PEP: "consumer",
  WMT: "consumer",
  PG: "consumer",
  UL: "consumer",
  CAT: "industrial",
  DE: "industrial",
  SIEGY: "industrial",
  SIE: "industrial",
};

export function rootSymbol(raw: string): string {
  const u = raw.trim().toUpperCase();
  const dot = u.lastIndexOf(".");
  if (dot <= 0) return u;
  const right = u.slice(dot + 1);
  if (right.length === 1) return u;
  return u.slice(0, dot);
}

function inferSectorFromTickerSymbol(symbol: string): DashboardSectorKey {
  const order: DashboardSectorKey[] = [
    "tech",
    "energy",
    "finance",
    "consumer",
    "industrial",
    "general",
  ];
  let h = 0;
  for (let i = 0; i < symbol.length; i++) {
    h = (h * 31 + symbol.charCodeAt(i) * (i + 3)) >>> 0;
  }
  return order[h % order.length];
}

export function resolveMappedSector(ticker: string): DashboardSectorKey {
  const sym = rootSymbol(ticker);
  if (TICKER_SECTOR_MAP[sym]) return TICKER_SECTOR_MAP[sym];
  return inferSectorFromTickerSymbol(sym);
}

/**
 * Alpha Vantage OVERVIEW liefert englische Sektoren (z. B. TECHNOLOGY).
 */
export function mapAlphaVantageSectorToKey(
  sector: string | null | undefined,
): DashboardSectorKey {
  if (!sector?.trim()) return "general";
  const s = sector.trim().toUpperCase();
  if (s.includes("TECH")) return "tech";
  if (s.includes("FINANC")) return "finance";
  if (s.includes("ENERGY")) return "energy";
  if (s.includes("UTILITIES")) return "general";
  if (s.includes("CONSUMER")) return "consumer";
  if (
    s.includes("INDUSTRIAL") ||
    s.includes("MATERIAL") ||
    s.includes("REAL ESTATE")
  ) {
    return "industrial";
  }
  if (s.includes("HEALTH")) return "general";
  return "general";
}
