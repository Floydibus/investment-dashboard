"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { ArrowRight, LineChart, Loader2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLocale } from "@/contexts/locale-context";
import { cn } from "@/lib/utils";

export type TickerSearchMatch = {
  symbol: string;
  name: string;
  region: string;
  type: string;
};

function normalizeTicker(raw: string): string {
  return raw.trim().replace(/\s+/g, "").toUpperCase();
}

/** US + internationale Notation (z. B. ROG.SW, BRK-B). */
function isValidTickerSymbol(s: string): boolean {
  return /^[A-Z0-9][A-Z0-9.\-]{0,23}$/.test(s);
}

export type TickerSearchProps = {
  className?: string;
  /** Ziel nach Auswahl — Standard: `/dashboard/{symbol}` */
  dashboardHref?: (symbol: string) => string;
};

type Row = {
  symbol: string;
  name: string;
  exchange?: string;
};

export function TickerSearch({
  className,
  dashboardHref = (symbol) => `/dashboard/${encodeURIComponent(symbol)}`,
}: TickerSearchProps) {
  const router = useRouter();
  const { t } = useLocale();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [remote, setRemote] = useState<TickerSearchMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchNotice, setSearchNotice] = useState<string | null>(null);

  const suggestions: Row[] = useMemo(() => {
    const fromApi: Row[] = remote.map((m) => ({
      symbol: m.symbol,
      name: m.name,
      exchange: [m.region, m.type].filter(Boolean).join(" · ") || undefined,
    }));
    return fromApi.slice(0, 16);
  }, [remote]);

  useEffect(() => {
    const q = query.trim();
    if (q.length < 1) {
      setRemote([]);
      setLoading(false);
      setSearchNotice(null);
      return;
    }

    const ac = new AbortController();
    const debounceMs = 320;
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setSearchNotice(null);
      try {
        const res = await fetch(
          `/api/search/tickers?q=${encodeURIComponent(q)}`,
          { signal: ac.signal },
        );
        const data = (await res.json()) as {
          matches?: TickerSearchMatch[];
          noApiKey?: boolean;
        };
        if (!ac.signal.aborted) {
          setRemote(Array.isArray(data.matches) ? data.matches : []);
          if (data.noApiKey) {
            setSearchNotice(t("search.noApiKey"));
          } else {
            setSearchNotice(null);
          }
        }
      } catch {
        if (!ac.signal.aborted) {
          setRemote([]);
          setSearchNotice(t("search.loading"));
        }
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    }, debounceMs);

    return () => {
      window.clearTimeout(timer);
      ac.abort();
    };
  }, [query, t]);

  const go = useCallback(
    (symbol: string) => {
      const s = normalizeTicker(symbol);
      if (!s || !isValidTickerSymbol(s)) return;
      router.push(dashboardHref(s));
      setOpen(false);
      setQuery("");
    },
    [dashboardHref, router],
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query, suggestions.length]);

  useEffect(() => {
    if (!open) return;
    function onDocMouseDown(e: MouseEvent) {
      const root = inputRef.current?.closest("[data-ticker-search]");
      if (root && !root.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [open]);

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    const maxIdx = Math.max(0, suggestions.length - 1);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, maxIdx));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = suggestions[activeIndex];
      if (pick) go(pick.symbol);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showList =
    open &&
    (suggestions.length > 0 ||
      loading ||
      searchNotice != null ||
      normalizeTicker(query).length > 0);

  return (
    <div
      data-ticker-search
      className={cn("relative w-full max-w-2xl", className)}
    >
      <div
        className={cn(
          "flex items-stretch gap-2 rounded-xl border border-border bg-card/80 p-2 shadow-lg shadow-black/20 backdrop-blur-md",
          open && "ring-2 ring-ring/60",
        )}
      >
        <div className="relative min-w-0 flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-5 -translate-y-1/2 text-muted-foreground"
            aria-hidden
          />
          <Input
            ref={inputRef}
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
            placeholder={t("search.placeholder")}
            className="h-12 border-0 bg-transparent pl-11 pr-3 text-base shadow-none focus-visible:ring-0"
            value={query}
            onChange={(ev) => {
              setQuery(ev.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onKeyDown={onKeyDown}
          />
        </div>
        <Button
          type="button"
          size="lg"
          className="h-12 shrink-0 rounded-lg px-5"
          disabled={loading || suggestions.length === 0}
          onClick={() => {
            const pick = suggestions[activeIndex];
            if (pick) go(pick.symbol);
          }}
        >
          {t("search.dashboardBtn")}
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>

      {showList ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-border bg-card py-1 shadow-xl"
        >
          {searchNotice ? (
            <li className="border-b border-border/60 px-4 py-2 text-xs text-amber-700 dark:text-amber-400">
              {searchNotice}
            </li>
          ) : null}
          {loading && suggestions.length === 0 ? (
            <li className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="size-4 shrink-0 animate-spin" aria-hidden />
              {t("search.loadingList")}
            </li>
          ) : null}
          {suggestions.map((s, idx) => (
            <li key={`${s.symbol}-${idx}`} role="presentation">
              <button
                type="button"
                role="option"
                aria-selected={idx === activeIndex}
                className={cn(
                  "flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition-colors",
                  idx === activeIndex
                    ? "bg-muted/60 text-foreground"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground",
                )}
                onMouseEnter={() => setActiveIndex(idx)}
                onMouseDown={(ev) => ev.preventDefault()}
                onClick={() => go(s.symbol)}
              >
                <span className="flex size-9 items-center justify-center rounded-md bg-muted/50">
                  <LineChart className="size-4 text-accent" aria-hidden />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-mono text-sm font-semibold tracking-wide text-foreground">
                    {s.symbol}
                  </span>
                  <span className="block truncate text-xs text-muted-foreground">
                    {s.name}
                    {s.exchange ? ` · ${s.exchange}` : ""}
                  </span>
                </span>
              </button>
            </li>
          ))}
          {!loading && suggestions.length === 0 && query.trim().length > 0 ? (
            <li className="px-4 py-3 text-sm text-muted-foreground">{t("search.emptyHint")}</li>
          ) : null}
        </ul>
      ) : null}
    </div>
  );
}
