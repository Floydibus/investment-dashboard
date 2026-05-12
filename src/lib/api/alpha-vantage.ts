/**
 * Alpha Vantage — Platzhalter für Kursdaten (TIME_SERIES_DAILY_ADJUSTED etc.).
 * UI-Komponenten importieren nur diese Funktionen, nicht fetch direkt.
 */
export type QuoteSnapshot = {
  symbol: string;
  currency: string;
  lastClose: number;
  previousClose: number;
  changePercent: number;
  asOf: string;
};

export async function fetchQuoteSnapshot(
  _symbol: string,
): Promise<QuoteSnapshot> {
  void _symbol;
  throw new Error(
    "Alpha Vantage nicht konfiguriert — verwenden Sie Mock-Daten oder setzen Sie ALPHA_VANTAGE_API_KEY.",
  );
}
