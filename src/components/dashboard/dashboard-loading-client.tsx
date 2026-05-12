"use client";

import { Loader2 } from "lucide-react";
import { useLocale } from "@/contexts/locale-context";

export function DashboardLoadingClient() {
  const { t } = useLocale();
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-slate-950 p-8 text-slate-300">
      <Loader2 className="size-10 animate-spin text-sky-400" aria-hidden />
      <p className="max-w-md text-center text-sm">{t("loading.page")}</p>
    </div>
  );
}
