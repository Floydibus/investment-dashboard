export type AppLocale = "de" | "en";

/** Aktuelle Keys (projektspezifisch — weniger Kollisionen als generisches `pulse_locale`). */
export const LOCALE_COOKIE = "invdash_locale";
export const LOCALE_STORAGE_KEY = "invdash_locale";
/** Nur nach Klick „Deutsch“/„English“ im Modal (oder späterer Wechsel) gesetzt — sonst Modal zeigen. */
export const LOCALE_CONFIRM_KEY = "invdash_lang_ok";

/** Alte Keys aus früheren Deployments — nur noch lesen/migrieren, nicht für neue Schreibvorgänge. */
export const LEGACY_LOCALE_COOKIE = "pulse_locale";
export const LEGACY_LOCALE_STORAGE_KEY = "pulse_locale";

export function parseLocale(raw: string | null | undefined): AppLocale {
  return raw === "en" ? "en" : "de";
}
