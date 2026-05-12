import { cookies } from "next/headers";
import type { AppLocale } from "@/lib/i18n/app-locale";
import {
  LEGACY_LOCALE_COOKIE,
  LOCALE_COOKIE,
  parseLocale,
} from "@/lib/i18n/app-locale";

/** Nur in Server Components / Route Handlers importieren — nicht aus Client-Bundles. */
export async function readServerLocale(): Promise<AppLocale> {
  try {
    const jar = await cookies();
    const v =
      jar.get(LOCALE_COOKIE)?.value ?? jar.get(LEGACY_LOCALE_COOKIE)?.value;
    return parseLocale(v);
  } catch {
    return "de";
  }
}
