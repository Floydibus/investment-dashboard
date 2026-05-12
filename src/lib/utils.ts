import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Heutiges Datum für Anzeige, z. B. „Dienstag, 12. Mai 2026“ — aktualisiert sich täglich (Client: Render-Zeitpunkt). */
export function formatInvestorDateDe(date: Date = new Date()): string {
  const raw = date.toLocaleDateString("de-DE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return raw.charAt(0).toUpperCase() + raw.slice(1);
}
