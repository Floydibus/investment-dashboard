import type { QuoteSnapshot } from "@/lib/api/alpha-vantage";
import type { NewsArticle } from "@/lib/api/finnhub";

/** Mock-Daten für Vertiv (VRT) — Layout & Dashboard-Tests ohne API-Keys. */
export const MOCK_VRT_SYMBOL = "VRT";

export const mockVrtQuote: QuoteSnapshot = {
  symbol: "VRT",
  currency: "USD",
  lastClose: 118.42,
  previousClose: 115.88,
  changePercent: 2.19,
  asOf: new Date().toISOString().slice(0, 10),
};

export const mockVrtAnalystConsensusUsd = 125;

export const mockVrtInstitutionalLabel = "Netto-Zukäufe Q1 2026";

/** Tages-Schlusskurse (Mock) für Header-Sparkline — letzte 14 Handelstage. */
export const mockVrtSparkline: { date: string; close: number }[] = [
  { date: "2026-04-21", close: 108.2 },
  { date: "2026-04-22", close: 109.55 },
  { date: "2026-04-23", close: 107.9 },
  { date: "2026-04-24", close: 110.1 },
  { date: "2026-04-25", close: 111.4 },
  { date: "2026-04-28", close: 110.8 },
  { date: "2026-04-29", close: 112.6 },
  { date: "2026-04-30", close: 113.05 },
  { date: "2026-05-01", close: 114.2 },
  { date: "2026-05-02", close: 113.4 },
  { date: "2026-05-05", close: 114.9 },
  { date: "2026-05-06", close: 116.1 },
  { date: "2026-05-09", close: 115.88 },
  { date: "2026-05-12", close: 118.42 },
];

export const mockVrtPriceContext = {
  previousClose: 115.88,
  sessionHigh: 119.05,
  sessionLow: 116.2,
  volumeMln: 2.4,
  marketCapBln: 44.2,
};

/** Feste ISO-Daten für reproduzierbare News-Filter (5d / 30d). */
export const mockVrtNews: NewsArticle[] = [
  {
    id: "vrt-n1",
    headline:
      "Neue Kühltechnologie für Rechenzentren vorgestellt — höhere Dichte pro Rack",
    source: "Mock Wire",
    url: "#",
    datetime: "2026-05-11T14:00:00.000Z",
  },
  {
    id: "vrt-n2",
    headline:
      "Expansion in den DACH-Markt beschleunigt — neues Partnernetzwerk und Service-Hub in Frankfurt",
    source: "Mock Wire",
    url: "#",
    datetime: "2026-05-10T09:30:00.000Z",
  },
  {
    id: "vrt-n2b",
    headline:
      "CEO: Kapazitätserweiterung in APAC läuft planmäßig — zusätzliche Fertigungslinie Q4",
    source: "Mock Wire",
    url: "#",
    datetime: "2026-05-09T07:00:00.000Z",
  },
  {
    id: "vrt-n3",
    headline: "Vertiv meldet starke Nachfrage nach KI-Kühlung in Nordamerika",
    source: "Mock Wire",
    url: "#",
    datetime: "2026-05-04T16:00:00.000Z",
  },
  {
    id: "vrt-n4",
    headline: "Analysten heben Kursziele nach robustem Datenzentrum-Zyklus an",
    source: "Mock Wire",
    url: "#",
    datetime: "2026-04-22T11:15:00.000Z",
  },
  {
    id: "vrt-n5",
    headline: "Langfristiger Rahmenvertrag mit Hyperscaler unterzeichnet",
    source: "Mock Wire",
    url: "#",
    datetime: "2026-04-18T08:00:00.000Z",
  },
  {
    id: "vrt-n6",
    headline: "Jahresauftakt: Margenführung im thermischen Management bestätigt",
    source: "Mock Wire",
    url: "#",
    datetime: "2026-04-14T10:00:00.000Z",
  },
];

export const mockVrtStrategic = {
  construction:
    "Werkserweiterung in South Carolina zu 85% abgeschlossen. Inbetriebnahme Q3 erwartet.",
  tech: "Patent für flüssigkeitsbasierte KI-Kühlung (Direct-to-Chip) genehmigt.",
  contracts:
    "Mehrjähriger Lieferrahmen mit führendem Cloud-Anbieter — Fokus Edge & KI-Cluster.",
};
