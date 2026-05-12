import type { AppLocale } from "@/lib/i18n/app-locale";

/** Shell-/Fehlerhinweise (SSR + Client) — getrennt von UI-Wörterbuch. */
export function shellInstitutionalHint(
  state: "no_api_key" | "unavailable",
  locale: AppLocale,
): string {
  if (locale === "en") {
    return state === "no_api_key"
      ? "Waiting for market data — add ALPHA_VANTAGE_API_KEY (Vercel) or NEXT_PUBLIC_ALPHA_VANTAGE_KEY (.env.local)."
      : "Waiting for market data — check ticker, network, or API limits.";
  }
  return state === "no_api_key"
    ? "Marktdaten werden geladen... bitte kurz warten. — Legen Sie ALPHA_VANTAGE_API_KEY (Vercel) oder NEXT_PUBLIC_ALPHA_VANTAGE_KEY (.env.local) an."
    : "Marktdaten werden geladen... bitte kurz warten.";
}
