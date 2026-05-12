"use client";

import { useEffect, useState } from "react";
import { formatInvestorDateDe } from "@/lib/utils";

type CurrentDateProps = {
  className?: string;
  prefix?: string;
};

/**
 * Zeigt immer das lokale Kalenderdatum (de-DE, lang).
 * Erst nach Mount gesetzt → vermeidet Hydration-Mismatch Server/Client.
 */
export function CurrentDate({ className, prefix = "Stand:" }: CurrentDateProps) {
  const [display, setDisplay] = useState<{ text: string; iso: string } | null>(null);

  useEffect(() => {
    const now = new Date();
    setDisplay({
      text: formatInvestorDateDe(now),
      iso: now.toISOString().slice(0, 10),
    });
  }, []);

  return (
    <span className={className}>
      {prefix ? (
        <>
          {prefix}{" "}
        </>
      ) : null}
      <time dateTime={display?.iso} suppressHydrationWarning>
        {display?.text ?? "…"}
      </time>
    </span>
  );
}
