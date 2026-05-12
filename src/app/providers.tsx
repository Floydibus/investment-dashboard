"use client";

import { LocaleProvider } from "@/contexts/locale-context";
import {
  LanguageFloatingButton,
  LanguagePickerModal,
} from "@/components/i18n/language-picker-modal";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <LocaleProvider>
      {children}
      <LanguagePickerModal />
      <LanguageFloatingButton />
    </LocaleProvider>
  );
}
