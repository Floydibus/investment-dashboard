import type { NewsArticle } from "@/lib/api/finnhub";
import {
  mockVrtAnalystConsensusUsd,
  mockVrtInstitutionalLabel,
  mockVrtNews,
  mockVrtPriceContext,
  mockVrtQuote,
  mockVrtSparkline,
  mockVrtStrategic,
} from "@/lib/data/mock-vertiv";

export type DashboardQuote = {
  last: number;
  changePercent: number;
  currency: string;
  asOfDate: string;
};

export type DashboardSparkPoint = {
  date: string;
  close: number;
};

export type DashboardPriceContext = {
  previousClose: number;
  sessionHigh: number | null;
  sessionLow: number | null;
  volumeMln: number | null;
  marketCapBln: number | null;
};

/** Kern-Sektoren plus typische Erweiterungen für realistische Zuordnung. */
export type DashboardSectorKey =
  | "tech"
  | "healthcare"
  | "energy"
  | "finance"
  | "consumer"
  | "industrial";

export const SECTOR_LABEL_DE: Record<DashboardSectorKey, string> = {
  tech: "Technologie (Software, Halbleiter & digitale Infrastruktur)",
  healthcare: "Healthcare (Pharma, Biotech & Medizintechnik)",
  energy: "Energy (Öl, Gas, erneuerbare Energien & Infrastruktur)",
  finance: "Finanzdienstleistungen (Banken, Versicherungen & Kapitalmärkte)",
  consumer: "Konsum & Handel (FMCG, Einzelhandel & Logistik)",
  industrial: "Industrie & Infrastruktur (Automation, Bau & schwere Güter)",
};

/** Explizites Branchen-Mapping ausgewählter Liquiditäts- und Blue-Chip-Ticker. */
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
  VRT: "tech",
  LLY: "healthcare",
  JNJ: "healthcare",
  UNH: "healthcare",
  PFE: "healthcare",
  MRK: "healthcare",
  NVO: "healthcare",
  NOVN: "healthcare",
  ROG: "healthcare",
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

export type DashboardAISummary = {
  mappedSector: DashboardSectorKey;
  sectorLabelDe: string;
  headline: string;
  investmentThesis: string;
  operationsCapacityNarrative: string;
  technologyInnovationNarrative: string;
  contractsCommercialNarrative: string;
  risksCatalystsAndConclusion: string;
};

function rootSymbol(raw: string): string {
  const u = raw.trim().toUpperCase();
  const dot = u.lastIndexOf(".");
  if (dot <= 0) return u;
  const right = u.slice(dot + 1);
  if (right.length === 1) return u;
  return u.slice(0, dot);
}

export function resolveMappedSector(ticker: string): DashboardSectorKey {
  const sym = rootSymbol(ticker);
  if (TICKER_SECTOR_MAP[sym]) return TICKER_SECTOR_MAP[sym];
  return inferSectorFromTickerSymbol(sym);
}

/** Deterministische Sektor-Vermutung für unbekannte Kürzel (Analysten-konsistente Diversifikation). */
function inferSectorFromTickerSymbol(symbol: string): DashboardSectorKey {
  const order: DashboardSectorKey[] = [
    "tech",
    "healthcare",
    "energy",
    "finance",
    "consumer",
    "industrial",
  ];
  let h = 0;
  for (let i = 0; i < symbol.length; i++) {
    h = (h * 31 + symbol.charCodeAt(i) * (i + 3)) >>> 0;
  }
  return order[h % order.length];
}

type KnownAISummaryFn = (symbol: string) => DashboardAISummary;

const KNOWN_AI_SUMMARIES: Record<string, KnownAISummaryFn> = {
  AAPL: (symbol) => ({
    mappedSector: "tech",
    sectorLabelDe: SECTOR_LABEL_DE.tech,
    headline:
      "Apple bleibt ein Qualitäts-Compoundierer mit Services-Hebel und integrierter Hardware-Ökonomie.",
    investmentThesis:
      "Aus Sicht des Research-Desks dominiert bei Apple die Kombination aus hochpreisigem Gerätezyklus, steigendem Services-Anteil und tiefer Ökosystem-Retention. Die Bewertung reflektiert zwar ein Premium auf Free-Cash-Flow, doch die Resilienz der installierten Basis rechtfertigt nach wie vor eine defensive Core-Position im globalen Tech-Block.",
    operationsCapacityNarrative:
      "Operativ bleibt die Lieferkette in Asien zentral; Kapazitätsplanung und Qualitätssicherung bei EMS-Partnern sind der Engpass, nicht die Markenstärke. Kapazitätserweiterungen bei Zulieferern für Gehäuse, Displays und Speicher werden eng mit Produkt-Roadmaps synchronisiert, um Launch-Fenster und Mix-Shift (Pro vs. Standard) abzusichern.",
    technologyInnovationNarrative:
      "Technologisch rücken On-Device-KI, Energieeffizenz der Silicon-Generationen und vertikale Integration von SoC und Sensorik in den Fokus. Die Differenzierung verlagert sich zunehmend von reinen GHz-Kennzahlen hin zu Workflows (Foto, Video, AR) und Datenschutzpositionierung — ein struktureller Vorteil gegenüber Android-OEMs.",
    contractsCommercialNarrative:
      "Kommerziell stützt sich das Wachstum auf App-Store-Ökonomie, Zahlungsdienstleistungen und B2B-Mobility-Bündnisse mit Carriern und Unternehmenskunden. Langfristige Abnahme- und Integrationsprojekte im Enterprise-Segment untermauieren wiederkehrende Umsatzqualität jenseits des reinen Hardware-Zyklus.",
    risksCatalystsAndConclusion:
      "Risiken umfassen regulatorische Eingriffe in digitale Marktplätze, geopolitische Friktionen in der Supply Chain sowie elongierte Smartphone-Refresh-Zyklen. Katalysatoren sind neue Formfaktoren, Services-Mix-Expansion und Kapitalrückführung. Fazit: Apple bleibt ein Benchmark für Cashflow-Stabilität im Large-Cap-Tech-Segment.",
  }),

  NVDA: (symbol) => ({
    mappedSector: "tech",
    sectorLabelDe: SECTOR_LABEL_DE.tech,
    headline:
      "NVIDIA profitiert strukturell von KI-Trainings- und Inferenzkapazität; die Narrative bleibt wachstumsgetrieben.",
    investmentThesis:
      "NVIDIA adressiert den zentralen Engpass der KI-Ära: beschleunigte Rechenleistung bei kontrolliertem Energiebudget. Der CUDA-Stack und Software-Ökosystem bilden hohe Switching Costs; die Bewertung setzt auf anhaltendes Capex der Hyperscaler und breitere Enterprise-Adoption von GPU-Clustern.",
    operationsCapacityNarrative:
      "Die Skalierung von CoWoS-Advanced-Packaging und Foundry-Kapazitäten bleibt der limitierende Faktor; Engpässe bei HBM-Speicher und Substraten können kurzfristig Umsatzrealisation verschieben. Strategisch investiert das Management in Multi-Sourcing und Partnerschaften entlang der gesamten Advanced-Node-Wertschöpfung.",
    technologyInnovationNarrative:
      "Innovationssprünge konzentrieren sich auf neue GPU-Architekturen, NVLink-Skalierung und spezialisierte Workloads (Training, Inference, Scientific Computing). Software-Innovation (TensorRT, Enterprise AI) monetarisiert Hardware-Performance und erhöht die Lock-in-Wirkung über reine Chip-ASP hinaus.",
    contractsCommercialNarrative:
      "Hyperscaler und große Cloud-Plattformen dominieren die Nachfrage; zunehmend gewinnen auch nationale Cloud- und Verteidigungsprogramme an Bedeutung. Rahmenverträge und Vororderungen sichern Sichtbarkeit über mehrere Quartale und unterstützen Planbarkeit der Margenstruktur.",
    risksCatalystsAndConclusion:
      "Risiken sind Zyklusüberhitzung, regulatorische Exportkontrollen sowie Konkurrenz von ASIC- und FPGA-Lösungen. Katalysatoren sind neue Produktfamilien, Software-Upsell und geografische Diversifikation der Kundenbasis. Fazit: NVIDIA bleibt der primäre Hebel auf strukturelles KI-Capex — mit entsprechender Volatilität.",
  }),

  NESN: (symbol) => ({
    mappedSector: "consumer",
    sectorLabelDe: SECTOR_LABEL_DE.consumer,
    headline:
      "Nestlé kombiniert globale Skaleneffekte mit Portfolio-Optimierung und Preisdisziplin im defensiven FMCG-Segment.",
    investmentThesis:
      "Nestlé positioniert sich als defensiver Cashflow-Generator mit Fokus auf Nutrition, Kaffee und Haustiernahrung. Die Bewertung spiegelt Vertrauen in Markenstärke und Emerging-Markets-Pipeline wider; Margenresilienz bei Rohstoffvolatilität bleibt der zentrale Proof-Point für institutionelle Allokation.",
    operationsCapacityNarrative:
      "Kapazitäts- und Logistikinvestitionen zielen auf Regionalisierung der Produktion, Reduktion von Frachtkosten und höhere Auslastung in Schlüsselwerken. Der Umbau des Portfolios (Divestments von Low-Margin-Linien) verbessert strukturell Kapitalintensität und ROIC-Profile.",
    technologyInnovationNarrative:
      "Technologisch rücken digitales D2C, Datengetriebene Innovation in Rezeptur und Nachhaltigkeits-Tracking sowie Automatisierung in Fertigungslinien in den Vordergrund. Diese Hebel unterstützen Premiumisierung und Transparenz entlang der Lieferkette — relevant für ESG-orientierte Mandate.",
    contractsCommercialNarrative:
      "Handels- und Listing-Verträge mit globalen Retailern sowie strategische Kooperationen im Gesundheits- und Wellness-Segment stabilisieren Absatzkanäle. Akquisitionen in Nischensegmenten (z. B. spezialisierte Nutrition) ergänzen organisches Wachstum und diversifizieren Währungs- und Regionalexposure.",
    risksCatalystsAndConclusion:
      "Risiken sind Inputkosten-Inflation, FX-Schwankungen und Volumendruck in entwickelten Märkten. Katalysatoren sind erfolgreiche Preisdurchsetzung, marginale Accretive M&A und Fortschritte bei CO₂-Reduktion. Fazit: Nestlé bleibt ein Referenzwert für defensive Qualität im Consumer-Block.",
  }),

  VRT: (symbol) => ({
    mappedSector: "tech",
    sectorLabelDe: SECTOR_LABEL_DE.tech,
    headline:
      "Vertiv profitiert vom strukturellen Ausbau von Rechenzentrumskapazität und thermischer Dichte im Umfeld KI-Workloads.",
    investmentThesis:
      "Vertiv adressiert kritische Infrastruktur für Stromversorgung, thermisches Management und Rack-Integration in Hyperscale- und Edge-Umgebungen. Das Investment-Case baut auf anhaltendem Datacenter-Capex, steigender Leistungsdichte pro Rack und wiederkehrendem Servicegeschäft; Bewertung und Free-Cash-Flow-Qualität sind eng an den Halbleiter- und Cloud-Zyklus gekoppelt.",
    operationsCapacityNarrative:
      "Werks- und Montagekapazitäten in Nordamerika und selektive Erweiterungen in APAC sind entscheidend, um Lieferfähigkeit bei Engpässen in der Lieferkette zu sichern. Fortschritte bei regionaler Fertigung und Lead-Time-Optimierung verbessern Planbarkeit für Großprojekte und reduzieren Fracht- und Zollrisiken.",
    technologyInnovationNarrative:
      "Flüssigkeitsbasierte Kühlkonzepte, höhere Effizienz bei PDU/UPS-Architekturen und modulare Systemdesigns adressieren thermische Grenzen moderner GPU-Cluster. IP und Zertifizierungen in kritischen Sicherheitsstandards stärken die Positionierung gegenüber Generalisten und regionalen Wettbewerbern.",
    contractsCommercialNarrative:
      "Langfristige Rahmenverträge mit Hyperscalern, Integratoren und Co-Location-Betreibern sichern Sichtbarkeit; nachgelagertes Service- und Ersatzteilgeschäft stabilisiert Margen über den Produktlebenszyklus. Partnerschaften mit OEMs und Engineering-Dienstleistern erweitern die Addressable Market im Edge-Segment.",
    risksCatalystsAndConclusion:
      "Risiken sind Zyklussensitivität, Rohstoff- und Komponentenverfügbarkeit sowie Konkurrenzintensität im Liquid-Cooling-Segment. Katalysatoren sind KI-getriebene Capex-Welle, Marktanteilsgewinne bei Premium-Kühlung und operative Hebel bei Skaleneffekten. Fazit: Vertiv bleibt ein klarer Hebel auf physische Datacenter-Infrastruktur mit attraktivem Wachstumsprofil bei zyklischer Volatilität.",
  }),
};

function buildSyntheticAISummary(
  symbol: string,
  sector: DashboardSectorKey,
): DashboardAISummary {
  const label = SECTOR_LABEL_DE[sector];
  const archetype = STRATEGIC_ARCHETYPES[sector];

  return {
    mappedSector: sector,
    sectorLabelDe: label,
    headline: `${symbol}: Plausible Einordnung im Segment ${label.split("(")[0].trim()} — qualitative Szenarioanalyse ohne Primärdatenabgleich.`,
    investmentThesis:
      `Für ${symbol} liegt kein issuer-spezifisches Research-Mandat vor; wir ordnen den Ticker konservativ dem Sektor ${label} zu. ` +
      "Aus Portfolioperspektive empfiehlt sich eine Bewertung relativ zum Sektor-Beta, Liquiditätsspread und implizitem Wachstumspfad der Peer-Gruppe. Bis zur Verfügbarkeit von Fundamentaldaten sollte jede Positionierung als explorative Allokation mit reduzierter Konviktion geführt werden.",
    operationsCapacityNarrative: archetype.operations(symbol),
    technologyInnovationNarrative: archetype.technology(symbol),
    contractsCommercialNarrative: archetype.commercial(symbol),
    risksCatalystsAndConclusion:
      `Hauptrisiken für ${symbol} umfassen Informationsasymmetrie, geringere Analysten-Abdeckung sowie potenziell höhere Spreads bei Stressphasien. ` +
      `Katalysatoren wären überdurchschnittliche Guidance, strukturelle Margenexpansion oder transaktionale Events im Umfeld des zugeordneten Sektors (${label}). ` +
      "Fazit: Die Einordnung dient der konsistenten Dashboard-Narrative; für Anlageentscheidungen ist eine Validierung mit Primärquellen unverzichtbar.",
  };
}

const STRATEGIC_ARCHETYPES: Record<
  DashboardSectorKey,
  {
    operations: (s: string) => string;
    technology: (s: string) => string;
    commercial: (s: string) => string;
  }
> = {
  tech: {
    operations: (s) =>
      `Im Szenario „${s}“ als Tech-Wert wären Kapazitätsengpässe typischerweise in Fertigungs- und Testpartnernetzen sowie in Rechenzentrums-Deployments zu verorten. Skalierung von Co-Location- und Edge-Knoten würde die operative Komplexität erhöhen; Management-Fokus auf Lieferketten-Resilienz und Lagerrotation bleibe der entscheidende Hebel für planbare Umsatzrealisation.`,
    technology: (s) =>
      `Technologiesprünge ließen sich plausibel im Bereich Beschleuniger-Architekturen, Software-Stapel für KI-Inferenz oder Sicherheits- und Observability-Stacks verorten. Für ${s} wäre die Differenzierung über IP, Ökosystem-Lock-in und Time-to-Market bei neuen Produktzyklen zu prüfen — klassische Treiber von Gross-Margin-Stabilität im Halbleiter- und Software-Ökosystem.`,
    commercial: (s) =>
      `Kommerziell wären Rahmenverträge mit Hyperscalern, Telkos oder Systemintegratoren sowie wiederkehrende Lizenz- und Nutzungsmodelle zentral. Für ${s} sollten Abnahmeverpflichtungen, NRR bei SaaS-ähnlichen Komponenten und geografische Diversifikation der Top-Kunden im Fokus institutioneller Mandate stehen.`,
  },
  healthcare: {
    operations: (s) =>
      `Im Healthcare-Szenario für ${s} wären Kapazitätsausbauten in Wirkstoffproduktion, sterile Fertigung oder Logistik temperaturgeführter Supply Chains relevant. Regulatory Affairs und Inspektionen durch Aufsichtsbehörden prägen die Geschwindigkeit operativer Skalierung — ein typisches Merkmal qualitätsgetriebener Pharma- und Biotech-Wertschöpfung.`,
    technology: (s) =>
      `Innovationstreiber umfassen klinische Datenpakete, Plattformtechnologien (mRNA, ADC, Zelltherapie) sowie digitale Endpunkte in Studien. Für ${s} wäre der technologische Sprung an Patentlandschaft, Orphan-Status und Evidenzgenerierung gegenüber Standard-of-Care zu knüpfen.`,
    commercial: (s) =>
      `Partnerschaften mit Big Pharma (Co-Development, Co-Promotion) sowie Listing- und Rabattverhandlungen mit Kostenträgern strukturieren die Erlöspfade. Für ${s} wären Royalty-Strukturen und geografische Roll-out-Fahrpläne zentrale Bewertungsanker.`,
  },
  energy: {
    operations: (s) =>
      `Operativ wären für ${s} Ausbau- und Wartungszyklen von Upstream-Anlagen, LNG-Kapazitäten oder Offshore-Infrastruktur prägend. Kapitalintensität und regulatorische Genehmigungsfahrpläne bestimmen die Sichtbarkeit von Volumen- und Kostenkurven.`,
    technology: (s) =>
      `Technologisch rücken digitale Zwillinge für Asset-Monitoring, CCUS-Technologien und Effizienzsteigerungen bei Exploration in den Fokus. Für ${s} wäre der Innovationspfad eng mit Dekarbonisierungs-Pfaden und Integration erneuerbarer Module verknüpft.`,
    commercial: (s) =>
      `Langfristige Offtake-Vereinbarungen, Hedging-Strukturen und Joint Ventures in strategischen Basins stabilisieren Cashflows. Für ${s} wären Preiskorrelationen zu Brent/TTF und geopolitische Lieferantenrisiken zentrale kommerzielle Variablen.`,
  },
  finance: {
    operations: (s) =>
      `Im Finanzsektor wäre für ${s} die Skalierung digitaler Vertriebskanäle, Effizienz in Kreditfabriken und regulatorische Kapitalpuffer operativ zentral. Filial- und IT-Investitionen bestimmen die Kostenstruktur bei parallelem Wettbewerb um Einlagenqualität.`,
    technology: (s) =>
      `Technologiesprünge betreffen Fraud-Detection mit ML, Core-Banking-Modernisierung und API-first-Ökosysteme für Embedded Finance. Für ${s} wäre die Integrationsgeschwindigkeit von Risk-Engines und Cloud-Migration ein Margen- und Risikotreiber.`,
    commercial: (s) =>
      `Mandate im Investment Banking, Treasury-Services und B2B-Zahlungsverkehr prägen wiederkehrende Fee-Income-Profile. Für ${s} wären Konzentration auf Großkunden und Zinsbindungs-Mismatch zentrale kommerzielle Sensitivitäten.`,
  },
  consumer: {
    operations: (s) =>
      `Für ${s} im Konsum-/Handelsumfeld wären Logistiknetzwerke, regionale Lagerkapazitäten und Omnichannel-Fulfillment die operativen Schwerpunkte. Private-Label-Expansion und SKU-Reduktion typischerweise Hebel auf Working Capital und Bruttomarge.`,
    technology: (s) =>
      `Technologisch rücken Demand Forecasting, Personalisierung am Point-of-Sale und Automatisierung in Distribution Centers in den Vordergrund. Für ${s} wären Daten-Ökosysteme und Loyalty-Programme zentrale Differenziatoren gegenüber rein preisgetriebenem Wettbewerb.`,
    commercial: (s) =>
      `Listing- und Rahmenverträge mit Handelsketten sowie strategische Kooperationen im E-Commerce-Umfeld strukturieren Absatz. Für ${s} wären Handelsmarketing-Budgets und Slotting-Fees relevante kommerzielle Hebel auf Nettoerlöse.`,
  },
  industrial: {
    operations: (s) =>
      `Im Industrieszenario für ${s} wären Werksautomatisierung, Nachschubketten für Spezialstähle und Montagekapazitäten für Großprojekte entscheidend. Auftragseingang und Backlog-Qualität bilden die Brücke zwischen CapEx-Zyklen und Umsatzrealisation.`,
    technology: (s) =>
      `Technologiesprünge verorten sich bei IoT-Sensorik, Robotik-Integration und energieeffizienten Antriebssystemen. Für ${s} wäre Software-Content in Maschinen („Equipment as a Service“) ein struktureller Margenhebel.`,
    commercial: (s) =>
      `OEM-Rahmenverträge, Service-Level-Agreements und langfristige Infrastrukturprojekte mit öffentlicher Hand prägen Erlössichtbarkeit. Für ${s} wären Konzentrationsrisiken bei Schlüsselkunden und Rohstoffindexierung zentrale kommerzielle Faktoren.`,
  },
};

export function generateAISummary(ticker: string): DashboardAISummary {
  const sym = rootSymbol(ticker);
  const known = KNOWN_AI_SUMMARIES[sym];
  if (known) return known(sym);
  const sector = resolveMappedSector(sym);
  return buildSyntheticAISummary(sym, sector);
}

const STRATEGIC_BRIEF: Record<
  DashboardSectorKey,
  {
    construction: (s: string) => string;
    tech: (s: string) => string;
    contracts: (s: string) => string;
  }
> = {
  tech: {
    construction: (s) =>
      `${s}: Skalierung von Fertigungs- und Integrationskapazität im Umfeld Rechenzentrum und Edge; Lieferketten-Resilienz bleibt der limitierende Faktor bei Großrollouts.`,
    tech: (s) =>
      `${s}: Differenzierung über IP, Software-Stack und Time-to-Market bei neuen Produktzyklen; KI-Workloads erhöhen thermische und energietechnische Anforderungen.`,
    contracts: (s) =>
      `${s}: Rahmenverträge mit Integratoren und Cloud-Ökosystemen sichern Sichtbarkeit; wiederkehrende Service-Erlöse stützen Margen über den Lebenszyklus.`,
  },
  healthcare: {
    construction: (s) =>
      `${s}: Ausbau GMP-konformer Kapazitäten und temperaturgeführte Logistik; regulatorische Inspektionen bestimmen den Rollout-Zeitplan.`,
    tech: (s) =>
      `${s}: Pipeline-Assets und Plattformtechnologien treiben Bewertung; Evidenzqualität vs. Standard-of-Care ist der zentrale technologische Hebel.`,
    contracts: (s) =>
      `${s}: Co-Development mit Big Pharma und Listing-Verhandlungen mit Kostenträgern strukturieren kommerzielle Upside-Szenarien.`,
  },
  energy: {
    construction: (s) =>
      `${s}: Infrastruktur- und Wartungs-Capex in Upstream/Midstream; LNG- und Netzausbau prägen operative Sichtbarkeit.`,
    tech: (s) =>
      `${s}: Digital Asset Monitoring, Effizienzprogramme und Dekarbonisierungs-Technologien (z. B. CCUS) als strukturelle Innovationsachsen.`,
    contracts: (s) =>
      `${s}: Langfristige Offtake- und Hedging-Strukturen stabilisieren Cashflows; geopolitische Versorgungspfade bleiben Sensitivität.`,
  },
  finance: {
    construction: (s) =>
      `${s}: Digitaler Vertrieb und Effizienz in Kreditfabriken; Kapitalpuffer und Reporting-Zyklen prägen operative Flexibilität.`,
    tech: (s) =>
      `${s}: Fraud-Analytics, Core-Modernisierung und API-Ökonomie monetarisieren Tech-Investitionen über Gebührenstruktur und Risikoadjustierung.`,
    contracts: (s) =>
      `${s}: Mandate im Treasury und Investment Banking sowie Zahlungsverkehrs-APIs stützen Fee-Income; Zinsbindungs-Management bleibt kritisch.`,
  },
  consumer: {
    construction: (s) =>
      `${s}: Logistik- und Fulfillment-Dichte, regionale Lagerkapazität und Omnichannel-Skalierung als operative Kernhebel.`,
    tech: (s) =>
      `${s}: Demand Forecasting, Personalisierung und Automatisierung im DC senken Fulfillment-Kosten und erhöhen Conversion.`,
    contracts: (s) =>
      `${s}: Listing-Rahmen mit Handelsketten und strategische E-Commerce-Partnerschaften sichern Kanalstabilität und Sichtbarkeit.`,
  },
  industrial: {
    construction: (s) =>
      `${s}: Werksautomatisierung und Montagekapazität für Großprojekte; Backlog-Qualität korreliert mit CapEx-Zyklen der Endmärkte.`,
    tech: (s) =>
      `${s}: IoT-Sensorik, Robotik und energieeffiziente Antriebe; „Equipment as a Service“ erhöht Software-Anteil am Erlös.`,
    contracts: (s) =>
      `${s}: OEM-Rahmenverträge und öffentliche Infrastrukturmandate; Rohstoffindexierung und Kundenkonzentration prägen Risikoprofil.`,
  },
};

function syntheticStrategic(
  symbol: string,
  sector: DashboardSectorKey,
): DashboardViewModel["strategic"] {
  const b = STRATEGIC_BRIEF[sector];
  return {
    construction: b.construction(symbol),
    tech: b.tech(symbol),
    contracts: b.contracts(symbol),
  };
}

function syntheticInstitutionalLine(sector: DashboardSectorKey): string {
  const lines: Record<DashboardSectorKey, string> = {
    tech:
      "Institutionelle Flows spiegeln derzeit hohe Allokation in Halbleiter- und Software-ETFs wider; Single-Stock-Rotation folgt dem Capex-Narrativ der Hyperscaler.",
    healthcare:
      "Defensive Mandate und Biotech-Rotation prägen institutionelle Nettozuflüsse; Fokus auf Pipeline-Binaries und Cash-Runway bei Mid-Caps.",
    energy:
      "Real-Asset- und Inflation-Hedging-Motive treiben institutionelle Nachfrage; Positionierung schwankt mit Kurvensteigung und geopolitischen Versorgungsszenarien.",
    finance:
      "Zinszyklus und Kreditqualität steuern Smart-Money-Rotation in Money-Center-Banks vs. Regionals; regulatorische Kapitalvorgaben bleiben Rahmenbedingung.",
    consumer:
      "Staples-Defensive und Handelsmargen im Fokus; institutionelle Selektion zugunsten starker Marken und Skaleneffekte in der Logistik.",
    industrial:
      "Zyklische Re-Opening- und Infrastrukturprogramme unterstützen institutionelle Beteiligung; Backlog-Qualität und Rohstoffpass-through sind Filterkriterien.",
  };
  return lines[sector];
}

function hashSparkline(symbol: string): DashboardSparkPoint[] {
  let seed = 0;
  for (let i = 0; i < symbol.length; i++) seed += symbol.charCodeAt(i) * (i + 7);
  const base = 95 + (seed % 25);
  const out: DashboardSparkPoint[] = [];
  for (let d = 13; d >= 0; d--) {
    const jitter = ((seed >> (d % 5)) & 7) / 10 - 0.35;
    out.push({
      date: `2026-05-${String(d + 1).padStart(2, "0")}`,
      close: Math.round((base + d * 0.4 + jitter) * 100) / 100,
    });
  }
  return out;
}

export type DashboardViewModel = {
  ticker: string;
  quote: DashboardQuote;
  priceContext: DashboardPriceContext;
  sparkline: DashboardSparkPoint[];
  analystConsensusUsd: number;
  institutionalLabel: string;
  institutionalPositive: boolean;
  news: NewsArticle[];
  strategic: {
    construction: string;
    tech: string;
    contracts: string;
  };
  aiSummary: DashboardAISummary;
};

export function getDashboardViewModel(ticker: string): DashboardViewModel {
  const upper = ticker.trim().toUpperCase();
  const aiSummary = generateAISummary(upper);

  if (upper === "VRT" || rootSymbol(upper) === "VRT") {
    return {
      ticker: "VRT",
      quote: {
        last: mockVrtQuote.lastClose,
        changePercent: mockVrtQuote.changePercent,
        currency: mockVrtQuote.currency,
        asOfDate: mockVrtQuote.asOf,
      },
      priceContext: {
        previousClose: mockVrtPriceContext.previousClose,
        sessionHigh: mockVrtPriceContext.sessionHigh,
        sessionLow: mockVrtPriceContext.sessionLow,
        volumeMln: mockVrtPriceContext.volumeMln,
        marketCapBln: mockVrtPriceContext.marketCapBln,
      },
      sparkline: mockVrtSparkline,
      analystConsensusUsd: mockVrtAnalystConsensusUsd,
      institutionalLabel: mockVrtInstitutionalLabel,
      institutionalPositive: true,
      news: mockVrtNews,
      strategic: mockVrtStrategic,
      aiSummary,
    };
  }

  const sector = aiSummary.mappedSector;
  const last = 100 + ((upper.charCodeAt(0) * 7 + upper.length * 3) % 45) / 10;
  const changePct =
    Math.round((((upper.charCodeAt(0) % 5) - 2) * 0.42) * 100) / 100;
  const prev = Math.round((last / (1 + changePct / 100)) * 100) / 100;

  return {
    ticker: upper,
    quote: {
      last: Math.round(last * 100) / 100,
      changePercent: changePct,
      currency: "USD",
      asOfDate: new Date().toISOString().slice(0, 10),
    },
    priceContext: {
      previousClose: prev,
      sessionHigh: Math.round((last + 1.2) * 100) / 100,
      sessionLow: Math.round((last - 1.1) * 100) / 100,
      volumeMln: 0.8 + (upper.length % 7) / 10,
      marketCapBln: null,
    },
    sparkline: hashSparkline(upper),
    analystConsensusUsd: Math.round(last * 1.07 * 100) / 100,
    institutionalLabel: syntheticInstitutionalLine(sector),
    institutionalPositive: changePct >= 0,
    news: [
      {
        id: `${upper}-n1`,
        headline: `${upper}: Sektor ${SECTOR_LABEL_DE[sector].split("(")[0].trim()} — Marktteilnehmer bewerten Liquidität und Guidance-Sensitivität neu.`,
        source: "Desk Research",
        url: "#",
        datetime: new Date().toISOString(),
      },
      {
        id: `${upper}-n2`,
        headline: `${upper}: Operative Skalierung und Capex-Disziplin stehen im Fokus institutioneller Mandate.`,
        source: "Desk Research",
        url: "#",
        datetime: new Date(Date.now() - 86400000 * 2).toISOString(),
      },
      {
        id: `${upper}-n3`,
        headline: `${upper}: Technologie- und Partnerschaftssignale prägen die mittelfristige Narrative im Peer-Vergleich.`,
        source: "Desk Research",
        url: "#",
        datetime: new Date(Date.now() - 86400000 * 9).toISOString(),
      },
    ],
    strategic: syntheticStrategic(upper, sector),
    aiSummary,
  };
}
