import { useMemo, useState } from "react";

import { useActiveAccount, useEntriesLoading, useIsJudge, useRankedSubmissions } from "../hooks";
import { EmptyState } from "../components/EmptyState";
import { Header } from "../components/Header";
import { JudgesSkeleton } from "../components/LoadingState";
import { RatingsIngest } from "../components/RatingsIngest";
import { SubmissionCard } from "../components/SubmissionCard";

type FilterMode = "all" | "unrated" | "rated";

function JudgesIntro({ unratedCount, filter, onFilterChange }: {
  unratedCount: number;
  filter: FilterMode;
  onFilterChange: (f: FilterMode) => void;
}) {
  return (
    <section className="page-shell max-w-2xl pt-8 pb-10 sm:pt-12 sm:pb-12">
      <p className="mb-3 font-mono text-xs tracking-[0.25em] text-flame uppercase">SEC-08 · Contest</p>
      <h1 className="font-display text-4xl leading-[0.95] font-extrabold tracking-tight text-neutral-50 sm:text-5xl lg:text-6xl">
        T-Shirt Design <span className="text-flame">Judging</span>
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
        Rate each entry from one to five stars. Your votes are signed to Nostr and scoped to this
        contest; other judges&apos; ratings stay hidden from you.
      </p>
      {unratedCount > 0 && (
        <p className="mt-3 font-mono text-sm text-flame-soft">
          {unratedCount} {unratedCount === 1 ? "entry" : "entries"} unrated
        </p>
      )}
      <div className="mt-4 flex gap-1.5">
        {(["all", "unrated", "rated"] as FilterMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onFilterChange(mode)}
            className={`rounded-md px-3 py-1.5 font-mono text-xs font-medium transition-colors ${
              filter === mode
                ? "bg-flame text-ink"
                : "bg-panel-2 text-muted hover:text-neutral-200"
            }`}
          >
            {mode === "all" ? "All" : mode === "unrated" ? `Unrated${unratedCount > 0 ? ` (${unratedCount})` : ""}` : "Rated"}
          </button>
        ))}
      </div>
    </section>
  );
}

export function JudgesPage() {
  return <JudgesPageContent />;
}

function JudgesPageContent() {
  const account = useActiveAccount();
  const isJudge = useIsJudge();
  const ranked = useRankedSubmissions();
  const loading = useEntriesLoading();
  const [filter, setFilter] = useState<FilterMode>("all");

  const filtered = useMemo(() => {
    if (!account || filter === "all") return ranked;
    return ranked.filter((item) => {
      const rated = account.pubkey in item.score.byJudge;
      return filter === "unrated" ? !rated : rated;
    });
  }, [ranked, account, filter]);

  const unratedCount = useMemo(
    () => (account ? ranked.filter((item) => !(account.pubkey in item.score.byJudge)).length : 0),
    [ranked, account],
  );

  return (
    <div className="min-h-full">
      <RatingsIngest />
      <Header mode="judges" submissionCount={filtered.length} />
      <JudgesIntro unratedCount={unratedCount} filter={filter} onFilterChange={setFilter} />

      <main className="page-shell max-w-6xl pb-24">
        {loading ? (
          <JudgesSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-16 sm:gap-20">
            {filtered.map((item, index) => (
              <SubmissionCard
                key={item.submission.id}
                item={item}
                index={index}
                isJudge={isJudge}
                viewerPubkey={account?.pubkey}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}