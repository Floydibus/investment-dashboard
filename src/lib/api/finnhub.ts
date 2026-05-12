/**
 * Finnhub — Platzhalter für Unternehmens-News und Metadaten.
 */
export type NewsArticle = {
  id: string;
  headline: string;
  source: string;
  url: string;
  datetime: string;
};

export async function fetchCompanyNews(
  _symbol: string,
  _from: string,
  _to: string,
): Promise<NewsArticle[]> {
  void _symbol;
  void _from;
  void _to;
  throw new Error(
    "Finnhub nicht konfiguriert — verwenden Sie Mock-Daten oder setzen Sie FINNHUB_API_KEY.",
  );
}
