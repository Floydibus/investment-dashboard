/** Bekannte Ticker für Autocomplete (erweiterbar / später API). */
export type TickerSuggestion = {
  symbol: string;
  name: string;
  exchange?: string;
};

export const TICKER_CATALOG: TickerSuggestion[] = [
  { symbol: "VRT", name: "Vertiv Holdings", exchange: "NYSE" },
  { symbol: "NVDA", name: "NVIDIA Corporation", exchange: "NASDAQ" },
  { symbol: "MSFT", name: "Microsoft Corporation", exchange: "NASDAQ" },
  { symbol: "AAPL", name: "Apple Inc.", exchange: "NASDAQ" },
  { symbol: "VRTX", name: "Vertex Pharmaceuticals", exchange: "NASDAQ" },
  { symbol: "VTRS", name: "Viatris Inc.", exchange: "NASDAQ" },
  { symbol: "VERX", name: "Veritone, Inc.", exchange: "NASDAQ" },
];
