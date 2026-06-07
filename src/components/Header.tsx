import { Link } from "react-router-dom";

import { LoginButton } from "./LoginButton";

const navLink =
  "font-mono text-xs text-muted underline-offset-4 transition-colors hover:text-flame hover:underline sm:text-sm";

const titles = {
  gallery: "SEC-08 T-Shirt Gallery",
  judges: "SEC-08 T-Shirt Judging",
} as const;

export function Header({ mode }: { mode: "gallery" | "judges" }) {
  return (
    <header className="sticky top-0 z-30 border-b border-edge/70 bg-ink/80 backdrop-blur-md">
      <div className="page-shell flex items-center justify-between gap-4 py-3 sm:py-3.5">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            to="/"
            className="shrink-0 text-neutral-200 transition-colors hover:text-flame"
            aria-label="Sovereign Engineering"
          >
            <img src="/soveng-brandmark.svg" alt="" width={32} height={32} />
          </Link>
          <span className="truncate font-display text-sm font-extrabold tracking-tight text-neutral-100 sm:text-base">
            {titles[mode]}
          </span>
        </div>

        {mode === "gallery" ? (
          <Link to="/judges" className={`${navLink} shrink-0`}>
            Login to judge
          </Link>
        ) : (
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            <Link to="/" className={navLink}>
              Gallery
            </Link>
            <LoginButton />
          </div>
        )}
      </div>
    </header>
  );
}
