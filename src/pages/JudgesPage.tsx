import { CONTEST } from "../config";
import { useActiveAccount, useIsJudge, useRankedSubmissions } from "../hooks";
import { EmptyState } from "../components/EmptyState";
import { Header } from "../components/Header";
import { SubmissionCard } from "../components/SubmissionCard";

function JudgesIntro({ count }: { count: number }) {
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
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-muted">
        <span>{count} Entries</span>
        <a
          href={CONTEST.brief}
          target="_blank"
          rel="noreferrer"
          className="text-flame underline-offset-4 hover:underline"
        >
          Prizes & rules ↗
        </a>
      </div>
    </section>
  );
}

export function JudgesPage() {
  const account = useActiveAccount();
  const isJudge = useIsJudge();
  const ranked = useRankedSubmissions();

  return (
    <div className="min-h-full">
      <Header mode="judges" />
      <JudgesIntro count={ranked.length} />

      <main className="page-shell max-w-6xl pb-24">
        {ranked.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="flex flex-col gap-16 sm:gap-20">
            {ranked.map((item, index) => (
              <SubmissionCard
                key={item.submission.id}
                variant="judge"
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
