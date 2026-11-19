import Link from "next/link";
import { ArrowRightIcon } from "./icons";

export function SectionHeading({
  eyebrow,
  title,
  href,
  linkLabel = "Ver todo",
  light = false,
}: {
  eyebrow?: string;
  title: string;
  href?: string;
  linkLabel?: string;
  light?: boolean;
}) {
  return (
    <div className="mb-7 flex items-end justify-between gap-6 md:mb-9">
      <div>
        {eyebrow && (
          <p className={`eyebrow ${light ? "text-paper/50" : "text-muted"}`}>{eyebrow}</p>
        )}
        <h2 className="display mt-2 text-[clamp(2rem,4.5vw,3.6rem)]">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className={`link-underline hidden shrink-0 items-center gap-2 pb-1 text-[11px] font-bold tracking-[0.14em] uppercase sm:inline-flex ${
            light ? "text-paper" : "text-ink"
          }`}
        >
          {linkLabel}
          <ArrowRightIcon size={15} />
        </Link>
      )}
    </div>
  );
}
