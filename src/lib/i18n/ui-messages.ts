import type { AppLocale } from "@/lib/i18n/app-locale";

const de = {
  "lang.title": "Sprache",
  "lang.subtitle": "Display language for Pulse",
  "lang.chooseDe": "Deutsch",
  "lang.chooseEn": "English",
  "lang.change": "Sprache",

  "home.badge": "Investment Intelligence",
  "home.hero1": "Jede Aktie.",
  "home.hero2": "Alle Daten. In Echtzeit.",
  "home.sub":
    "Globale Marktanalyse: Ticker eingeben (z. B. AAPL, TSLA, ROG.SW) — Kurs und Firmenprofil von Alpha Vantage, sofern ein API-Key gesetzt ist.",
  "home.tip":
    "Tipp: Vorschläge von Alpha Vantage · beliebigen Ticker mit Enter öffnen",
  "home.demo": "Demo mit AAPL öffnen",
  "home.footer": "Next.js App Router · Tailwind",
  "home.moduleLabel": "Modul · Dashboard",

  "mod1.title": "Kurse & Veränderung",
  "mod1.desc":
    "GLOBAL_QUOTE + OVERVIEW + Tages-Serie — serverseitig, Key in .env.local.",
  "mod2.title": "News-Feed",
  "mod2.desc": "Optional — noch nicht mit Feed verbunden.",
  "mod3.title": "Strategische Insights",
  "mod3.desc":
    "Sektor-Templates: Tech, Finance, Energy u. a. — keine ticker-spezifischen Texte.",
  "mod4.title": "Analysten & Flows",
  "mod4.desc": "Analystenziel aus Overview, falls geliefert.",

  "search.placeholder": "Ticker oder Name — z. B. SAP, ROG.SW, Toyota",
  "search.exchangeCheck": "Live-Kurs prüfen",
  "search.loading": "Marktdaten werden geladen... bitte kurz warten.",
  "search.noApiKey":
    "API-Key fehlt: ALPHA_VANTAGE_API_KEY oder NEXT_PUBLIC_ALPHA_VANTAGE_KEY setzen.",
  "search.dashboardBtn": "Dashboard",
  "search.directName": "Direkt zum Dashboard",
  "search.loadingList": "Marktdaten werden geladen... bitte kurz warten.",
  "search.emptyHint":
    "Marktdaten werden geladen... bitte kurz warten. Ticker prüfen oder später erneut versuchen. Gültige Symbole: Buchstaben, Zahlen, Punkt, Bindestrich — mit Enter direkt öffnen.",

  "loading.page": "Marktdaten werden geladen... bitte kurz warten.",

  "gate.loading": "Marktdaten werden geladen…",
  "gate.sub":
    "Kurz warten — bei vielen Wechseln kann Alpha Vantage (Free Tier) 1 Minute drosseln.",

  "dash.back": "← Zurück",
  "dash.bannerNoKey":
    "Marktdaten werden geladen... bitte kurz warten. Hinterlegen Sie ALPHA_VANTAGE_API_KEY (Vercel) oder NEXT_PUBLIC_ALPHA_VANTAGE_KEY in .env.local.",
  "dash.bannerUnavailable":
    "Marktdaten werden geladen... bitte kurz warten. ({ticker} — Limit, Netzwerk oder Symbol prüfen.)",
  "dash.analysis": "Marktanalyse",
  "dash.dataSource": "Datenquelle: Alpha Vantage · Symbol",
  "dash.waitingShort": "Marktdaten werden geladen... bitte kurz warten.",
  "dash.waitingTicker":
    "Marktdaten werden geladen... bitte kurz warten. ({ticker})",
  "dash.sparkSr": "Kursverlauf (14 Handelstage)",
  "dash.vsPrev": "(vs. Vortag)",
  "dash.priceData": "Kurs-Daten",
  "dash.last": "Letzter Kurs",
  "dash.prevClose": "Schluss Vortag",
  "dash.range": "Tagesrange",
  "dash.volume": "Volumen",
  "dash.volMio": "Mio.",
  "dash.mcap": "Marktkap.",
  "dash.mcapBln": "Mrd.",
  "dash.profile": "Firmenprofil (Overview)",
  "dash.noDesc": "Keine Beschreibung in der Overview-Antwort.",
  "dash.targets": "Kursziele & Kennzahlen",
  "dash.analystOverview": "Analystenziel (Overview)",
  "dash.analyst": "Analystenziel",
  "dash.noAnalystTarget": "Kein Ziel in Company Overview hinterlegt.",
  "dash.analystHigh": "Hoch (Analysten)",
  "dash.fairValue": "Fair Value (Schätz.)",
  "dash.institutional": "Institutionelle Trends",
  "dash.news": "News & Signale",
  "dash.tab5": "5 Tage",
  "dash.tab30": "30 Tage",
  "dash.noNews":
    "Kein News-Feed angebunden (optional: Finnhub). Marktanalyse läuft über Alpha Vantage.",
  "dash.research": "Research-Zusammenfassung",
  "dash.thesis": "Investment-These",
  "dash.ops": "Operative Expansion & Kapazität",
  "dash.tech": "Technologie & Innovation",
  "dash.commercial": "Kommerzialisierung & Partnerschaften",
  "dash.risks": "Risiken, Katalysatoren & Fazit",
  "dash.sparkWait": "Live-Serie nach Datenabruf",
  "dash.sparkEmpty": "Keine Serienpunkte",
  "dash.sparklineHint":
    "Kurzübersicht Vortag → aktueller Stand (14-Tage-Serie derzeit nicht verfügbar oder limitiert).",
  "dash.statIndustry": "Branche (Overview)",
  "dash.statSector": "Sektor (Overview)",
} as const;

const en: Record<keyof typeof de, string> = {
  "lang.title": "Language",
  "lang.subtitle": "Display language for Pulse",
  "lang.chooseDe": "Deutsch",
  "lang.chooseEn": "English",
  "lang.change": "Language",

  "home.badge": "Investment Intelligence",
  "home.hero1": "Every stock.",
  "home.hero2": "All data. In real time.",
  "home.sub":
    "Global market view: enter a ticker (e.g. AAPL, TSLA, ROG.SW) — price and company profile from Alpha Vantage when an API key is configured.",
  "home.tip": "Tip: Alpha Vantage suggestions · open any ticker with Enter",
  "home.demo": "Open demo with AAPL",
  "home.footer": "Next.js App Router · Tailwind",
  "home.moduleLabel": "Module · Dashboard",

  "mod1.title": "Prices & moves",
  "mod1.desc": "GLOBAL_QUOTE + OVERVIEW + daily series — server-side, key in .env.local.",
  "mod2.title": "News feed",
  "mod2.desc": "Optional — not connected to a feed yet.",
  "mod3.title": "Strategic insights",
  "mod3.desc": "Sector templates: tech, finance, energy, etc. — not ticker-specific copy.",
  "mod4.title": "Analysts & flows",
  "mod4.desc": "Analyst target from Overview when available.",

  "search.placeholder": "Ticker or name — e.g. SAP, ROG.SW, Toyota",
  "search.exchangeCheck": "Check live quote",
  "search.loading": "Loading market data… please wait.",
  "search.noApiKey":
    "Missing API key: set ALPHA_VANTAGE_API_KEY or NEXT_PUBLIC_ALPHA_VANTAGE_KEY.",
  "search.dashboardBtn": "Dashboard",
  "search.directName": "Open dashboard directly",
  "search.loadingList": "Loading market data… please wait.",
  "search.emptyHint":
    "Loading market data… check the ticker or try again later. Valid symbols: letters, digits, dot, hyphen — press Enter to open directly.",

  "loading.page": "Loading market data… please wait.",

  "gate.loading": "Loading market data…",
  "gate.sub":
    "Please wait — Alpha Vantage free tier may throttle for about a minute after many switches.",

  "dash.back": "← Back",
  "dash.bannerNoKey":
    "Loading market data… please add ALPHA_VANTAGE_API_KEY (Vercel) or NEXT_PUBLIC_ALPHA_VANTAGE_KEY in .env.local.",
  "dash.bannerUnavailable":
    "Loading market data… ({ticker} — check limits, network, or symbol.)",
  "dash.analysis": "Market analysis",
  "dash.dataSource": "Data source: Alpha Vantage · Symbol",
  "dash.waitingShort": "Loading market data… please wait.",
  "dash.waitingTicker": "Loading market data… ({ticker}).",
  "dash.sparkSr": "Price trend (14 sessions)",
  "dash.vsPrev": "(vs. previous close)",
  "dash.priceData": "Price data",
  "dash.last": "Last price",
  "dash.prevClose": "Previous close",
  "dash.range": "Day range",
  "dash.volume": "Volume",
  "dash.volMio": "M",
  "dash.mcap": "Market cap",
  "dash.mcapBln": "B",
  "dash.profile": "Company profile (Overview)",
  "dash.noDesc": "No description in the Overview response.",
  "dash.targets": "Targets & metrics",
  "dash.analystOverview": "Analyst target (Overview)",
  "dash.analyst": "Analyst target",
  "dash.noAnalystTarget": "No target in Company Overview.",
  "dash.analystHigh": "High (analysts)",
  "dash.fairValue": "Fair value (est.)",
  "dash.institutional": "Institutional trends",
  "dash.news": "News & signals",
  "dash.tab5": "5 days",
  "dash.tab30": "30 days",
  "dash.noNews":
    "No news feed connected (optional: Finnhub). Market analysis uses Alpha Vantage.",
  "dash.research": "Research summary",
  "dash.thesis": "Investment thesis",
  "dash.ops": "Operations & capacity",
  "dash.tech": "Technology & innovation",
  "dash.commercial": "Commercialization & partnerships",
  "dash.risks": "Risks, catalysts & conclusion",
  "dash.sparkWait": "Live series after data load",
  "dash.sparkEmpty": "No series points",
  "dash.sparklineHint":
    "Short view: previous close → current (14-day series unavailable or rate-limited).",
  "dash.statIndustry": "Industry (Overview)",
  "dash.statSector": "Sector (Overview)",
};

export type UiMessageKey = keyof typeof de;

const table: Record<AppLocale, Record<UiMessageKey, string>> = { de, en };

export function uiT(locale: AppLocale, key: UiMessageKey): string {
  return table[locale][key] ?? table.de[key];
}
