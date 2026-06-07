import { Link } from "react-router-dom";

import { CONTEST } from "../config";
import { LoginButton } from "./LoginButton";

const navLink =
  "font-mono text-xs text-muted underline-offset-4 transition-colors hover:text-flame hover:underline sm:text-sm";

const SOVENG_TAG_URL = "https://ants.sh/t/SovEng";

function HeaderTitle({ mode }: { mode: "gallery" | "judges" }) {
  const label = mode === "gallery" ? "Gallery" : "Judging";

  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <span className="shrink-0 rounded border border-flame/30 bg-flame/10 px-1.5 py-0.5 font-mono text-[10px] font-medium tracking-[0.18em] text-flame">
        SEC-08
      </span>
      <span className="truncate font-display text-base font-bold tracking-tight text-neutral-50 sm:text-lg">
        T-Shirt <span className="text-flame">{label}</span>
      </span>
    </div>
  );
}

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
          <HeaderTitle mode={mode} />
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
