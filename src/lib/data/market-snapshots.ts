import type { NewsArticle } from "@/lib/api/finnhub";

/** Gemeinsame Helfer für „rolling“ News-Daten relativ zum Aufrufdatum. */
export function isoDaysAgo(days: number): string {
  return new Date(Date.now() - days * 86400000).toISOString();
}

export function buildSparklineFromTrend(
  endClose: number,
  startClose: number,
  days = 14,
): { date: string; close: number }[] {
  const out: { date: string; close: number }[] = [];
  const span = Math.max(days - 1, 1);
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() - i);
    const t = (days - 1 - i) / span;
    const close = startClose + (endClose - startClose) * t;
    out.push({
      date: d.toISOString().slice(0, 10),
      close: Math.round(close * 100) / 100,
    });
  }
  return out;
}

export function getMsftNews(): NewsArticle[] {
  return [
    {
      id: "msft-n1",
      headline:
        "Microsoft: Azure und KI-Dienste ziehen Umsatz — Margen im Blickpunkt der Analysten.",
      source: "Markt",
      url: "#",
      datetime: isoDaysAgo(1),
    },
    {
      id: "msft-n2",
      headline:
        "Fair-Value-Debatte: viele Modelle liegen deutlich über dem aktuellen Kurs — Abhängigkeit vom Cloud-Wachstum bleibt.",
      source: "Research",
      url: "#",
      datetime: isoDaysAgo(5),
    },
    {
      id: "msft-n3",
      headline: "Office- und Copilot-Pricing: schrittweise Preiserhöhungen stützen wiederkehrende Erlöse.",
      source: "Produkt",
      url: "#",
      datetime: isoDaysAgo(20),
    },
  ];
}

export function getPltrNews(): NewsArticle[] {
  return [
    {
      id: "pltr-n1",
      headline:
        "Palantir: Q1 über den Erwartungen — Guidance für das Gesamtjahr auf rund 7,66 Mrd. USD angehoben.",
      source: "Earnings",
      url: "#",
      datetime: isoDaysAgo(1),
    },
    {
      id: "pltr-n2",
      headline:
        "US-Regierungsgeschäft stabil; kommerzielle KI-Plattform gewinnt bei größeren Konzernen an Bedeutung.",
      source: "Segment",
      url: "#",
      datetime: isoDaysAgo(4),
    },
    {
      id: "pltr-n3",
      headline: "Ausblick: Investoren bewerten Wachstum vs. Bewertung — Volatilität bleibt hoch.",
      source: "Markt",
      url: "#",
      datetime: isoDaysAgo(14),
    },
  ];
}
