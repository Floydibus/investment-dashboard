"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { AppLocale } from "@/lib/i18n/app-locale";
import {
  LEGACY_LOCALE_COOKIE,
  LEGACY_LOCALE_STORAGE_KEY,
  LOCALE_CONFIRM_KEY,
  LOCALE_COOKIE,
  LOCALE_STORAGE_KEY,
  parseLocale,
} from "@/lib/i18n/app-locale";
import type { UiMessageKey } from "@/lib/i18n/ui-messages";
import { uiT } from "@/lib/i18n/ui-messages";

type LocaleContextValue = {
  locale: AppLocale;
  setLocale: (l: AppLocale) => void;
  t: (key: UiMessageKey) => string;
  languageModalOpen: boolean;
  openLanguageModal: () => void;
  closeLanguageModal: () => void;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readCookieValue(name: string): string | null {
  if (typeof document === "undefined") return null;
  const row = document.cookie.split("; ").find((r) => r.startsWith(`${name}=`));
  if (!row) return null;
  const raw = row.slice(name.length + 1);
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

function readLocaleCookie(): AppLocale | null {
  const primary = readCookieValue(LOCALE_COOKIE);
  if (primary === "en" || primary === "de") return primary;
  const legacy = readCookieValue(LEGACY_LOCALE_COOKIE);
  if (legacy === "en" || legacy === "de") return legacy;
  return null;
}

function writeLocaleCookie(locale: AppLocale) {
  if (typeof document === "undefined") return;
  const maxAge = 60 * 60 * 24 * 400;
  document.cookie = `${LEGACY_LOCALE_COOKIE}=;path=/;max-age=0;samesite=lax`;
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${maxAge};samesite=lax`;
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<AppLocale>("de");
  const [languageModalOpen, setLanguageModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    try {
      const confirmed =
        window.localStorage.getItem(LOCALE_CONFIRM_KEY) === "1";
      const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
      if (confirmed && (stored === "de" || stored === "en")) {
        const l = parseLocale(stored);
        setLocaleState(l);
        writeLocaleCookie(l);
        setLanguageModalOpen(false);
        return;
      }

      const legacyStored = window.localStorage.getItem(
        LEGACY_LOCALE_STORAGE_KEY,
      );
      const fromCookie = readLocaleCookie();
      const hint =
        stored === "de" || stored === "en"
          ? (stored as AppLocale)
          : legacyStored === "de" || legacyStored === "en"
            ? (legacyStored as AppLocale)
            : fromCookie;

      if (hint) {
        setLocaleState(hint);
      }
      setLanguageModalOpen(true);
    } catch {
      setLanguageModalOpen(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === "en" ? "en" : "de";
  }, [locale]);

  const setLocale = useCallback(
    (l: AppLocale) => {
      setLocaleState(l);
      try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, l);
        window.localStorage.setItem(LOCALE_CONFIRM_KEY, "1");
        window.localStorage.removeItem(LEGACY_LOCALE_STORAGE_KEY);
      } catch {
        /* ignore */
      }
      writeLocaleCookie(l);
      setLanguageModalOpen(false);
      queueMicrotask(() => {
        router.refresh();
      });
    },
    [router],
  );

  const t = useCallback(
    (key: UiMessageKey) => {
      return uiT(locale, key);
    },
    [locale],
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      languageModalOpen,
      openLanguageModal: () => setLanguageModalOpen(true),
      closeLanguageModal: () => setLanguageModalOpen(false),
    }),
    [locale, setLocale, t, languageModalOpen],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return ctx;
}
