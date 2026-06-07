import { useActiveAccount, useEntriesLoading, useIsJudge, useRankedSubmissions } from "../hooks";
import { EmptyState } from "../components/EmptyState";
import { Header } from "../components/Header";
import { JudgesSkeleton } from "../components/LoadingState";
import { RatingsIngest } from "../components/RatingsIngest";
import { SubmissionCard } from "../components/SubmissionCard";

function JudgesIntro() {
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

  return (
    <div className="min-h-full">
      <RatingsIngest />
      <Header mode="judges" submissionCount={ranked.length} />
      <JudgesIntro />

      <main className="page-shell max-w-6xl pb-24">
        {loading ? (
          <JudgesSkeleton />
        ) : ranked.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-16 sm:gap-20">
            {ranked.map((item, index) => (
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