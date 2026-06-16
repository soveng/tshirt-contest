import { useEntriesLoading, useLeaderboard } from "../hooks";
import { Header } from "../components/Header";
import { JudgesSkeleton } from "../components/LoadingState";
import { RatingsIngest } from "../components/RatingsIngest";
import { ResultsList } from "../components/ResultsList";
import { WinnersPodium } from "../components/WinnersPodium";

function ResultsIntro() {
  return (
    <section className="page-shell max-w-2xl pt-8 pb-10 sm:pt-12 sm:pb-12">
      <p className="mb-3 font-mono text-xs tracking-[0.25em] text-flame uppercase">SEC-08 · Contest</p>
      <h1 className="font-display text-4xl leading-[0.95] font-extrabold tracking-tight text-neutral-50 sm:text-5xl lg:text-6xl">
        T-Shirt Design <span className="text-flame">Results</span>
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
        Ranked by average judge score. Scores update as judges rate entries on Nostr.
      </p>
    </section>
  );
}

function ResultsEmptyState() {
  return (
    <div className="page-shell max-w-xl py-24">
      <img src="/flame.svg" alt="" width={40} height={40} className="mb-4 opacity-60" />
      <p className="text-neutral-300">No ratings yet.</p>
      <p className="mt-2 text-sm text-muted">
        Results appear once judges start rating entries. Check back after judging begins.
      </p>
    </div>
  );
}

export function ResultsPage() {
  const { leaderboard, winners, rest } = useLeaderboard();
  const loading = useEntriesLoading();

  return (
    <div className="min-h-full">
      <RatingsIngest />
      <Header mode="results" submissionCount={leaderboard.length} />
      <ResultsIntro />

      <main className="page-shell max-w-6xl pb-24">
        {loading ? (
          <JudgesSkeleton />
        ) : leaderboard.length === 0 ? (
          <ResultsEmptyState />
        ) : (
          <div className="flex flex-col gap-12 sm:gap-16">
            <WinnersPodium items={winners} />
            {rest.length > 0 && (
              <section>
                <h2 className="mb-4 font-mono text-xs tracking-[0.2em] text-muted uppercase">
                  Rest of the field
                </h2>
                <ResultsList items={rest} />
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
