import { Link } from "react-router-dom";

import { CONTEST } from "../config";
import { LoginButton } from "./LoginButton";

const navLink =
  "font-mono text-xs text-muted underline-offset-4 transition-colors hover:text-flame hover:underline sm:text-sm";

const SOVENG_TAG_URL = "https://ants.sh/t/SovEng";

const titles = {
  gallery: "SEC-08 T-Shirt Gallery",
  judges: "SEC-08 T-Shirt Judging",
} as const;

function RulesLink() {
  return (
    <a href={CONTEST.brief} target="_blank" rel="noreferrer" className={navLink}>
      Rules ↗
    </a>
  );
}

function SubmissionsLink({ count }: { count: number }) {
  return (
    <a href={SOVENG_TAG_URL} target="_blank" rel="noreferrer" className={navLink}>
      {count} submissions
    </a>
  );
}

export function Header({ mode, submissionCount }: { mode: "gallery" | "judges"; submissionCount: number }) {
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

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          <SubmissionsLink count={submissionCount} />
          <RulesLink />
          {mode === "gallery" ? (
            <Link to="/judges" className={navLink}>
              Login to judge
            </Link>
          ) : (
            <>
              <Link to="/" className={navLink}>
                Gallery
              </Link>
              <LoginButton />
            </>
          )}
        </div>
      </div>
    </header>
  );
}
