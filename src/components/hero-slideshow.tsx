import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { slideshowImages } from "@/lib/gallery";
import { t, type Locale } from "@/lib/content";
import { asset, cn } from "@/lib/utils";

const INTERVAL = 5500;

export function HeroSlideshow({ locale }: { locale: Locale }) {
  const c = t(locale);
  const images = slideshowImages;
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduce, setReduce] = useState(false);
  const touchX = useRef<number | null>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduce(mq.matches);
    const onChange = () => setReduce(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const go = useCallback(
    (dir: number) => {
      if (images.length === 0) return;
      setIndex((i) => (i + dir + images.length) % images.length);
    },
    [images.length],
  );

  useEffect(() => {
    if (reduce || paused || images.length < 2) return;
    const id = window.setInterval(() => go(1), INTERVAL);
    return () => window.clearInterval(id);
  }, [reduce, paused, images.length, go]);

  useEffect(() => {
    const next = images[(index + 1) % images.length];
    if (!next) return;
    const img = new Image();
    img.src = asset(next.src);
  }, [index, images]);

  if (images.length === 0) {
    return <div className="absolute inset-0 bg-surface" aria-hidden="true" />;
  }

  return (
    <div
      className="absolute inset-0 h-full overflow-hidden bg-bg"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => {
        touchX.current = e.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        const end = e.changedTouches[0]?.clientX;
        touchX.current = null;
        if (start == null || end == null) return;
        const dx = end - start;
        if (dx > 48) go(-1);
        if (dx < -48) go(1);
      }}
    >
      {images.map((img, i) => {
        const nearby =
          i === index ||
          i === (index + 1) % images.length ||
          i === (index - 1 + images.length) % images.length;
        if (!nearby) return null;
        return (
          <div
            key={img.src}
            className={cn(
              "hero-slide absolute inset-0 transition-opacity duration-700 ease-out",
              i === index ? "slide-ken opacity-100" : "opacity-0",
            )}
            aria-hidden={i !== index}
          >
            <img
              src={asset(img.src)}
              alt=""
              className="absolute inset-0 size-full object-cover"
              draggable={false}
              fetchPriority={i === 0 ? "high" : "low"}
            />
          </div>
        );
      })}

      <div className="hero-veil pointer-events-none absolute inset-0" />

      <div className="absolute inset-x-0 bottom-0 z-10 flex items-end justify-end gap-3 px-4 pb-5 sm:px-6 sm:pb-6">
        <div className="flex shrink-0 items-center gap-1">
          <Control label={c.prev} onClick={() => go(-1)}>
            <ChevronLeft className="size-4" />
          </Control>
          <Control label={paused ? c.play : c.pause} onClick={() => setPaused((v) => !v)}>
            {paused ? <Play className="size-3.5" /> : <Pause className="size-3.5" />}
          </Control>
          <Control label={c.next} onClick={() => go(1)}>
            <ChevronRight className="size-4" />
          </Control>
        </div>
      </div>
    </div>
  );
}

function Control({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-10 items-center justify-center rounded-md border border-fg/15 bg-bg/40 text-fg backdrop-blur-sm hover:bg-bg/70"
    >
      {children}
    </button>
  );
}
