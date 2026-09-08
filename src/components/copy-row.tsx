import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { Locale } from "@/lib/content";
import { t } from "@/lib/content";

export function CopyRow({
  label,
  value,
  locale,
}: {
  label: string;
  value: string;
  locale: Locale;
}) {
  const [done, setDone] = useState(false);
  const c = t(locale);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(normalize(value));
      setDone(true);
      toast.success(c.copied);
      window.setTimeout(() => setDone(false), 1600);
    } catch {
      toast.error(c.copy);
    }
  }

  return (
    <button
      type="button"
      onClick={onCopy}
      className="group flex w-full items-start justify-between gap-4 rounded-md border border-line bg-surface px-4 py-3.5 text-left transition-[background-color,border-color] duration-150 hover:border-accent/40 hover:bg-surface-2"
    >
      <span className="min-w-0">
        <span className="block text-xs font-medium tracking-wide text-muted uppercase">
          {label}
        </span>
        <span className="mt-1 block font-mono text-sm leading-snug break-all text-fg">
          {value}
        </span>
      </span>
      <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-sm text-muted group-hover:text-fg">
        {done ? <Check className="size-4" /> : <Copy className="size-4" />}
        <span className="sr-only">{c.copy}</span>
      </span>
    </button>
  );
}

function normalize(value: string) {
  const compact = value.replace(/\s+/g, "");
  if (/^[0-9]{16}$/.test(compact)) return compact;
  if (compact.length > 20 && /^(bc1|0x|T|C|48)/.test(compact)) return compact;
  return value.trim();
}
