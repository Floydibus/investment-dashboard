import type { CompanyOverview } from "@/lib/api/alpha-vantage";
import {
  type DashboardSectorKey,
  SECTOR_LABEL_DE,
} from "@/lib/data/sector-keys";

export type StrategicSectionTitles = {
  construction: string;
  tech: string;
  contracts: string;
};

type AISummaryShape = {
  mappedSector: DashboardSectorKey;
  sectorLabelDe: string;
  headline: string;
  investmentThesis: string;
  operationsCapacityNarrative: string;
  technologyInnovationNarrative: string;
  contractsCommercialNarrative: string;
  risksCatalystsAndConclusion: string;
};

function clipDescription(text: string | null, max = 220): string | null {
  if (!text) return null;
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max)}…`;
}

function titlesForSector(sector: DashboardSectorKey): StrategicSectionTitles {
  switch (sector) {
    case "tech":
      return {
        construction: "Roadmap & Skalierung",
        tech: "Technologie, IP & Patente",
        contracts: "Go-to-Market & Partner",
      };
    case "finance":
      return {
        construction: "Zins- & Marktumfeld",
        tech: "Kreditqualität & Risiko",
        contracts: "Liquidität & Refinanzierung",
      };
    case "energy":
      return {
        construction: "Kapazitäten & Infrastruktur",
        tech: "Rohstoffe & Märkte",
        contracts: "Regulatorik & Langfristgeschäft",
      };
    case "consumer":
      return {
        construction: "Volumen & Supply Chain",
        tech: "Preis & Mix",
        contracts: "Handel & Marken",
      };
    case "industrial":
      return {
        construction: "Aufträge & Auslastung",
        tech: "Automation & Effizienz",
        contracts: "OEM & Service",
      };
    default:
      return {
        construction: "Operatives Umfeld",
        tech: "Struktur & Wettbewerb",
        contracts: "Kunden & Verträge",
      };
  }
}

function strategicBlocks(
  sector: DashboardSectorKey,
  ticker: string,
): Pick<
  AISummaryShape,
  | "operationsCapacityNarrative"
  | "technologyInnovationNarrative"
  | "contractsCommercialNarrative"
> {
  const t = ticker.trim().toUpperCase();
  switch (sector) {
    case "tech":
      return {
        operationsCapacityNarrative:
          `${t}: Produkt-Roadmap und Release-Zyklen bestimmen Umsatztiming. Skalierung hängt an Fertigung, Cloud-Kapazität und Integrationspartnern — Engpässe wirken direkt auf Free Cash Flow.`,
        technologyInnovationNarrative:
          "Patente, SDKs und Halbleiter-/Software-IP schützen Preise. KI-Workloads erhöhen Rechen- und Kühlbedarf; Differenzierung über Performance, Sicherheit und Ökosystem-Lock-in.",
        contractsCommercialNarrative:
          "Hyperscaler-, Telko- und Enterprise-Rahmenverträge geben Sichtbarkeit. Wiederkehrende Nutzungs-/Lizenzmodelle und Marktplatz-Anteile sind die üblichen Hebel auf ARR/NRR.",
      };
    case "finance":
      return {
        operationsCapacityNarrative:
          `${t}: Kurvenlage und Zentralbankpfade steuern NIM und Bewertung von Bank-/Versicherungsaktien. Achten Sie auf Guidance zu Einlagenwachstum und Kreditkosten.`,
        technologyInnovationNarrative:
          "Kreditausfallraten, Stage-3-Quote und provisionsbedarfte Risikovorsorge zeigen Asset-Qualität. Makro-Stress testet Konservatismus der Modelle — Transparenz im Reporting ist Pflicht.",
        contractsCommercialNarrative:
          "LCR/NSFR und Refinanzierungsfenster bestimmen Liquiditätsrisiko. Fee-Geschäft (Payments, Vermögensverwaltung) diversifiziert gegen rein zinsgetriebene Margen.",
      };
    case "energy":
      return {
        operationsCapacityNarrative:
          `${t}: Förder- und Transportkapazitäten (Upstream/Midstream), LNG- und Raffinerieauslastung prägen operatives Profil. Wartungs- und Capex-Zyklen beeinflussen Cash-Konvertierung.`,
        technologyInnovationNarrative:
          "Öl-, Gas- und Strompreise (Brent, TTF, Henry Hub) sind die schnellen Treiber. Hedge-Ratio und geografische Basis-Spreads erklären Abweichungen zum Benchmark.",
        contractsCommercialNarrative:
          "CO₂- und Netzregulierung, Genehmigungen sowie Offtake-/PPA-Verträge setzen langfristige Preis- und Volumenpfade. Geopolitik bleibt Volatilitätsfaktor bei Versorgung und Transport.",
      };
    case "consumer":
      return {
        operationsCapacityNarrative:
          `${t}: Volumen, Handelslisten und regionale Logistik bestimmen kurzfristig Umsatz. Werks- und Lagerflexibilität entscheidet bei Rohstoff- oder FX-Schocks.`,
        technologyInnovationNarrative:
          "Pricing-Power, Mix (Premium vs. Value) und Promotion-Disziplin steuern Bruttomarge. Daten in Forecasting und D2C senken Working Capital.",
        contractsCommercialNarrative:
          "Rahmen mit Handel und Gastronomie, Franchise-Systeme und internationale Märkte strukturieren Kanalrisiko. Konzentration auf wenige Retailer bleibt Watchpoint.",
      };
    case "industrial":
      return {
        operationsCapacityNarrative:
          `${t}: Backlog, Lieferzeiten und Montagekapazität koppeln an CapEx-Zyklen der Endmärkte. Rohstoff- und Lohninflation beeinflussen Pass-Through.`,
        technologyInnovationNarrative:
          "Automatisierung, Sensorik und energieeffiziente Antriebe senken Stückkosten. Software-Anteil („as a Service“) kann Margen stabilisieren.",
        contractsCommercialNarrative:
          "OEM-Rahmen, öffentliche Infrastrukturmandate und Serviceverträge geben Planbarkeit. Laufzeiten und Indexklauseln bestimmen Risiko bei Nachfrageeinbrüchen.",
      };
    default:
      return {
        operationsCapacityNarrative:
          `${t}: Operatives Profil hängt von Segment, Region und Skalierung ab — ohne Branchen-Spezialannahme nur Rahmen: Auslastung, Working Capital, Guidance.`,
        technologyInnovationNarrative:
          "Digitalisierung, Kosteneffizienz und Produktdifferenzierung sind generische Hebel; issuer-spezifische Treiber aus Profil und Wettbewerb ableiten.",
        contractsCommercialNarrative:
          "B2B-Rahmen, Großkunden und Partnernetze geben Sichtbarkeit; Konzentration und politische Rahmenbedingungen bleiben Standardrisiken.",
      };
  }
}

function institutionalLine(sector: DashboardSectorKey): string {
  const m: Record<DashboardSectorKey, string> = {
    tech: "Flows folgen KI- und Datacenter-Capex; Einzeltitel reagieren stark auf Guidance und Halbleiter-Zyklus.",
    finance: "Smart Money gewichtet Zinswend, Kreditzyklus und Kapitalrendite — Volatilität bei Makrodaten.",
    energy: "Real-Asset- und Inflationssensitivität; geopolitische Versorgung treibt kurzfristige Rotation.",
    consumer: "Defensive vs. zyklische Konsumwerte: Fokus auf Pricing, Volumen und FX.",
    industrial: "Auftragseingang und China/US-Indikatorik prägen zyklische Bewertung.",
    general: "Breite Marktliquidität und ETF-Flows prägen viele diversifizierte Namen.",
  };
  return m[sector];
}

export function buildSmartAnalysis(
  displayTicker: string,
  sector: DashboardSectorKey,
  overview: CompanyOverview | null,
): {
  aiSummary: AISummaryShape;
  strategicTitles: StrategicSectionTitles;
  institutionalLabel: string;
} {
  const label = SECTOR_LABEL_DE[sector];
  const name = overview?.name?.trim() || displayTicker;
  const desc = clipDescription(overview?.description ?? null);
  const industry = overview?.industry?.trim();

  const blocks = strategicBlocks(sector, displayTicker);

  const headline = industry
    ? `${name} (${displayTicker}) — ${industry}, Sektor: ${overview?.sector ?? label}.`
    : `${name} (${displayTicker}) — Einordnung: ${label.split("(")[0].trim()}.`;

  const investmentThesis = desc
    ? `Profil (Kurzfassung): ${desc}`
    : `${displayTicker}: Profiltext folgt, sobald das Firmen-Overview geladen ist. Bis dahin gelten die sektorüblichen Treiber in den Karten unten.`;

  const risks =
    "Risiko: Makro, Bewertung, Wettbewerb, Regulatorik. Katalysator: Quartalszahlen, Guidance, strukturelle Margen- oder Marktanteils-Trends. Keine Anlageberatung — Daten mit Primärquellen prüfen.";

  return {
    aiSummary: {
      mappedSector: sector,
      sectorLabelDe: label,
      headline,
      investmentThesis,
      ...blocks,
      risksCatalystsAndConclusion: risks,
    },
    strategicTitles: titlesForSector(sector),
    institutionalLabel: institutionalLine(sector),
  };
}

export function buildStrategicFromTemplates(
  sector: DashboardSectorKey,
  ticker: string,
): { construction: string; tech: string; contracts: string } {
  const b = strategicBlocks(sector, ticker);
  return {
    construction: b.operationsCapacityNarrative,
    tech: b.technologyInnovationNarrative,
    contracts: b.contractsCommercialNarrative,
  };
}
