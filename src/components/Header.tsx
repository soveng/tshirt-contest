import { Link } from "react-router-dom";

import { CONTEST } from "../config";
import { LoginButton } from "./LoginButton";
import { SortMenu, type SortOption } from "./SortMenu";

const navLink =
  "font-mono text-xs text-muted underline-offset-4 transition-colors hover:text-flame hover:underline sm:text-sm";

const headerButton =
  "inline-flex items-center rounded-lg px-3.5 py-1.5 text-sm font-semibold leading-none transition-transform hover:scale-105";

const primaryButton = `${headerButton} bg-flame text-ink`;

const SOVENG_TAG_URL = "https://ants.sh/t/SovEng";
const SOVENG_APPLY_URL = "https://sovereignengineering.io/#apply";

function HeaderTitle({ mode }: { mode: "gallery" | "judges" }) {
  const label = mode === "gallery" ? "Gallery" : "Judging";

  return (
    <span className="truncate font-display text-base font-bold tracking-tight text-neutral-50 sm:text-lg">
      <a
        href={SOVENG_APPLY_URL}
        target="_blank"
        rel="noreferrer"
        className="text-flame transition-colors hover:text-flame-soft"
      >
        SEC-08
      </a>{" "}
      T-Shirt {label}
    </span>
  );
}

function SubmitDesignButton() {
  return (
    <a href={CONTEST.brief} target="_blank" rel="noreferrer" className={primaryButton}>
      Submit Design
    </a>
  );
}

function SubmissionsLink({ count }: { count: number }) {
  return (
    <a
      href={SOVENG_TAG_URL}
      target="_blank"
      rel="noreferrer"
      className={navLink}
      aria-label={`${count} submissions on ants.sh`}
    >
      {count} submissions ↗
    </a>
  );
}

export function Header({
  mode,
  submissionCount,
  sort,
  onSortChange,
}: {
  mode: "gallery" | "judges";
  submissionCount: number;
  sort?: SortOption;
  onSortChange?: (next: SortOption) => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-edge/70 bg-ink/80 backdrop-blur-md">
      <div className="page-shell flex items-center justify-between gap-4 py-3 sm:py-3.5">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <a
            href="https://sovereignengineering.io/"
            target="_blank"
            rel="noreferrer"
            className="shrink-0 text-neutral-200 transition-colors hover:text-flame"
            aria-label="Sovereign Engineering"
          >
            <img src="/soveng-brandmark.svg" alt="" width={32} height={32} />
          </a>
          <HeaderTitle mode={mode} />
          <div className="flex shrink-0 items-center gap-3 border-l border-edge/70 pl-3 sm:gap-4 sm:pl-4">
            {sort && onSortChange && <SortMenu value={sort} onChange={onSortChange} />}
            <SubmissionsLink count={submissionCount} />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-3 sm:gap-4">
          {mode === "gallery" ? (
            <>
              <Link to="/judges" className={navLink}>
                Login to judge
              </Link>
              <SubmitDesignButton />
            </>
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
