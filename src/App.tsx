import { useState } from "react";

import { CONTEST } from "./config";
import { useActiveAccount, useIsJudge, useRankedSubmissions } from "./hooks";
import { Header } from "./components/Header";
import { SubmissionCard } from "./components/SubmissionCard";
import { SubmissionModal } from "./components/SubmissionModal";

function Intro({ count }: { count: number }) {
  return (
    <section className="mx-auto max-w-6xl px-5 pt-8 pb-7 sm:pt-12 sm:pb-8">
      <p className="mb-3 font-mono text-xs tracking-[0.25em] text-flame uppercase">SEC-08 · Contest</p>
      <h1 className="max-w-3xl font-display text-4xl leading-[0.95] font-extrabold tracking-tight text-neutral-50 sm:text-5xl lg:text-6xl">
        T-Shirt Design <span className="text-flame">Contest</span>
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
        Designs posted to Nostr with{" "}
        <span className="font-mono text-neutral-200">#SovEng</span>, judged here by the four contest
        judges. Each judge rates from one to five stars; the average decides the ranking.
      </p>
      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-muted">
        <span>
          <span className="text-neutral-400">Deadline</span> {CONTEST.deadline}
        </span>
        <span>
          <span className="text-neutral-400">Entries</span> {count}
        </span>
        <a
          href={CONTEST.brief}
          target="_blank"
          rel="noreferrer"
          className="text-flame underline-offset-4 hover:underline"
        >
          Read the brief ↗
        </a>
      </div>
    </section>
  );
}

function Empty() {
  return (
    <div className="mx-auto max-w-md px-5 py-24 text-center">
      <img src="/flame.svg" alt="" width={40} height={40} className="mx-auto mb-4 opacity-60" />
      <p className="text-neutral-300">No submissions yet.</p>
      <p className="mt-2 text-sm text-muted">
        Post a mockup on Nostr with <span className="font-mono text-neutral-300">#SovEng</span> and it
        will show up here.
      </p>
    </div>
  );
}

export default function App() {
  const account = useActiveAccount();
  const blind = useIsJudge();
  const ranked = useRankedSubmissions(blind);
  const [openId, setOpenId] = useState<string | null>(null);
  const open = ranked.find((r) => r.submission.id === openId) ?? null;

  return (
    <div className="min-h-full">
      <Header />
      <Intro count={ranked.length} />

      <main className="mx-auto max-w-6xl px-5 pb-24">
        {ranked.length === 0 ? (
          <Empty />
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {ranked.map((item, index) => (
              <SubmissionCard
                key={item.submission.id}
                item={item}
                index={index}
                blind={blind}
                viewerPubkey={account?.pubkey}
                onOpen={() => setOpenId(item.submission.id)}
              />
            ))}
          </div>
        )}
      </main>

      {open && <SubmissionModal item={open} onClose={() => setOpenId(null)} />}
    </div>
  );
}
