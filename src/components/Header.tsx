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

function HeaderTitle({ mode }: { mode: "gallery" | "judges" | "results" }) {
  const label =
    mode === "gallery" ? "Gallery" : mode === "judges" ? "Judging" : "Results";

  return (
    <span className="min-w-0 truncate font-display text-base font-bold tracking-tight text-neutral-50 sm:text-lg">
      <Link
        to="/"
        className="text-flame no-underline transition-colors hover:text-flame-soft hover:no-underline"
      >
        SEC-08
      </Link>
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

/** Font Awesome Free 6.5.1 medal (CC BY 4.0) — https://fontawesome.com/icons/medal */
function MedalIcon({ size = 15 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 512 512" fill="currentColor" aria-hidden>
      <path
        d="M4.1 38.2C1.4 34.2 0 29.4 0 24.6C0 11 11 0 24.6 0H133.9c11.2 0 21.7 5.9 27.4 15.5l68.5 114.1c-48.2 6.1-91.3 28.6-123.4 61.9L4.1 38.2zm503.7 0L405.6 191.5c-32.1-33.3-75.2-55.8-123.4-61.9L350.7 15.5C356.5 5.9 366.9 0 378.1 0H487.4C501 0 512 11 512 24.6c0 4.8-1.4 9.6-4.1 13.6zM80 336a176 176 0 1 1 352 0A176 176 0 1 1 80 336zm184.4-94.9c-3.4-7-13.3-7-16.8 0l-22.4 45.4c-1.4 2.8-4 4.7-7 5.1L168 298.9c-7.7 1.1-10.7 10.5-5.2 16l36.3 35.4c2.2 2.2 3.2 5.2 2.7 8.3l-8.6 49.9c-1.3 7.6 6.7 13.5 13.6 9.9l44.8-23.6c2.7-1.4 6-1.4 8.7 0l44.8 23.6c6.9 3.6 14.9-2.2 13.6-9.9l-8.6-49.9c-.5-3 .5-6.1 2.7-8.3l36.3-35.4c5.6-5.4 2.5-14.8-5.2-16l-50.1-7.3c-3-.4-5.7-2.4-7-5.1l-22.4-45.4z"
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
      <MedalIcon />
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
            <Link
              to="/"
              className="shrink-0 text-neutral-200 no-underline transition-colors hover:text-flame hover:no-underline"
              aria-label="SEC-08 T-Shirt Contest"
            >
              <img src="/soveng-brandmark.svg" alt="" width={32} height={32} />
            </Link>
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
