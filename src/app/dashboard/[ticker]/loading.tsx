import { Loader2 } from "lucide-react";

export default function DashboardLoading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 bg-slate-950 p-8 text-slate-300">
      <Loader2 className="size-10 animate-spin text-sky-400" aria-hidden />
      <p className="max-w-md text-center text-sm">
        Marktdaten werden geladen... bitte kurz warten.
      </p>
    </div>
  );
}
