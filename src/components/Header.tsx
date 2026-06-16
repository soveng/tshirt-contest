import { Link } from "react-router-dom";

import { CONTEST } from "../config";
import { JudgeLoginLink } from "./JudgeLoginLink";
import { LoginButton } from "./LoginButton";
import { SortMenu, type SortOption } from "./SortMenu";

const navLink =
  "font-mono text-xs text-muted underline-offset-4 transition-colors hover:text-flame hover:underline sm:text-sm";

const headerButton =
  "inline-flex items-center rounded-lg px-2.5 py-2 text-sm font-semibold leading-none transition-transform hover:scale-105 sm:px-3.5";

const primaryButton = `${headerButton} bg-flame text-ink`;

const SOVENG_TAG_URL = "https://ants.sh/t/SovEng";
const SOVENG_APPLY_URL = "https://sovereignengineering.io/#apply";

function HeaderTitle({ mode }: { mode: "gallery" | "judges" | "results" }) {
  const label =
    mode === "gallery" ? "Gallery" : mode === "judges" ? "Judging" : "Results";

  return (
    <span className="min-w-0 truncate font-display text-base font-bold tracking-tight text-neutral-50 sm:text-lg">
      <a
        href={SOVENG_APPLY_URL}
        target="_blank"
        rel="noreferrer"
        className="text-flame transition-colors hover:text-flame-soft"
      >
        SEC-08
      </a>
      <span className="hidden sm:inline">
        {" "}
        T-Shirt {label}
      </span>
    </span>
  );
}

function SubmitDesignButton() {
  return (
    <a href={CONTEST.brief} target="_blank" rel="noreferrer" className={primaryButton}>
      <span className="sm:hidden">Submit</span>
      <span className="hidden sm:inline">Submit Design</span>
    </a>
  );
}

function TrophyIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path
        d="M19 5h-2V3H7v2H5a2 2 0 00-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.002 5.002 0 0012 18.17a5.002 5.002 0 004.61-3.23C19.08 14.63 21 12.55 21 10V7a2 2 0 00-2-2zM7 10V7h2v3a4 4 0 008 0V7h2v3a4 4 0 01-8 0zM5 19v2h14v-2H5z"
      />
    </svg>
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
      <span className="sm:hidden">{count} ↗</span>
      <span className="hidden sm:inline">{count} submissions ↗</span>
    </a>
  );
}

function ResultsLink({ active }: { active?: boolean }) {
  return (
    <Link
      to="/results"
      className={`inline-flex shrink-0 rounded-md p-0.5 no-underline transition-colors hover:text-flame hover:no-underline ${
        active ? "text-flame" : "text-muted"
      }`}
      aria-label="Results"
      aria-current={active ? "page" : undefined}
    >
      <TrophyIcon />
    </Link>
  );
}

function RatedCount({ count }: { count: number }) {
  return (
    <span className="font-mono text-xs text-muted sm:text-sm">
      {count} rated
    </span>
  );
}

function HeaderMeta({
  mode,
  submissionCount,
  sort,
  onSortChange,
}: {
  mode: "gallery" | "judges" | "results";
  submissionCount: number;
  sort?: SortOption;
  onSortChange?: (next: SortOption) => void;
}) {
  return (
    <div className="flex items-center gap-3 sm:gap-4">
      {sort && onSortChange && <SortMenu value={sort} onChange={onSortChange} />}
      <div className="flex items-center gap-1.5">
        {mode === "results" ? (
          <RatedCount count={submissionCount} />
        ) : (
          <SubmissionsLink count={submissionCount} />
        )}
        <ResultsLink active={mode === "results"} />
      </div>
    </div>
  );
}

export function Header({
  mode,
  submissionCount,
  sort,
  onSortChange,
}: {
  mode: "gallery" | "judges" | "results";
  submissionCount: number;
  sort?: SortOption;
  onSortChange?: (next: SortOption) => void;
}) {
  return (
    <header className="sticky top-0 z-30 border-b border-edge/70 bg-ink/80 backdrop-blur-md">
      <div className="page-shell py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-4">
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
            <div className="hidden min-w-0 items-center gap-3 border-l border-edge/70 pl-3 sm:flex sm:gap-4 sm:pl-4">
              <HeaderMeta
                mode={mode}
                submissionCount={submissionCount}
                sort={sort}
                onSortChange={onSortChange}
              />
            </div>
          </div>

          <div className="flex min-w-0 shrink items-center gap-1.5 sm:gap-3">
            {mode === "gallery" ? (
              <>
                <JudgeLoginLink />
                <SubmitDesignButton />
              </>
            ) : mode === "judges" ? (
              <>
                <Link to="/" className={`${navLink} hidden sm:inline`}>
                  Gallery
                </Link>
                <LoginButton compact />
              </>
            ) : (
              <>
                <Link to="/" className={`${navLink} hidden sm:inline`}>
                  Gallery
                </Link>
                <Link to="/judges" className={`${navLink} hidden sm:inline`}>
                  Judging
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="mt-2 flex items-center gap-3 border-t border-edge/50 pt-2 sm:hidden">
          {mode === "judges" && (
            <Link to="/" className={navLink}>
              Gallery
            </Link>
          )}
          {mode === "results" && (
            <>
              <Link to="/" className={navLink}>
                Gallery
              </Link>
              <Link to="/judges" className={navLink}>
                Judging
              </Link>
            </>
          )}
          <HeaderMeta
            mode={mode}
            submissionCount={submissionCount}
            sort={sort}
            onSortChange={onSortChange}
          />
        </div>
      </div>
    </header>
  );
}
