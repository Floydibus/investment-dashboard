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
import { ArrowRight, LineChart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { getTickerSuggestions } from "@/lib/search/suggestion-service";
import type { TickerSuggestion } from "@/lib/data/ticker-catalog";

export type TickerSearchProps = {
  className?: string;
  /** Ziel nach Auswahl — Standard: `/dashboard/{symbol}` */
  dashboardHref?: (symbol: string) => string;
};

export function TickerSearch({
  className,
  dashboardHref = (symbol) => `/dashboard/${encodeURIComponent(symbol)}`,
}: TickerSearchProps) {
  const router = useRouter();
  const listId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const suggestions: TickerSuggestion[] = useMemo(
    () => getTickerSuggestions(query, 8),
    [query],
  );

  const go = useCallback(
    (symbol: string) => {
      const s = symbol.trim().toUpperCase();
      if (!s) return;
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
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const pick = suggestions[activeIndex];
      if (pick) go(pick.symbol);
      else if (query.trim()) go(query);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

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
            placeholder="Ticker suchen — z. B. VRT, NVDA, MSFT"
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
          onClick={() => {
            const pick = suggestions[activeIndex];
            if (pick) go(pick.symbol);
            else if (query.trim()) go(query);
          }}
        >
          Dashboard
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>

      {open && suggestions.length > 0 ? (
        <ul
          id={listId}
          role="listbox"
          className="absolute z-50 mt-2 max-h-72 w-full overflow-auto rounded-xl border border-border bg-card py-1 shadow-xl"
        >
          {suggestions.map((s, idx) => (
            <li key={s.symbol} role="presentation">
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
        </ul>
      ) : null}
    </div>
  );
}
