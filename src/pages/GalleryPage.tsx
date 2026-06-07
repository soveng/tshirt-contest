import { CONTEST } from "../config";
import { useSubmissions } from "../hooks";
import { EmptyState } from "../components/EmptyState";
import { GalleryCard } from "../components/GalleryCard";
import { Header } from "../components/Header";

function GalleryIntro({ count }: { count: number }) {
  return (
    <section className="page-shell max-w-2xl pb-7 pt-7 sm:pb-9 sm:pt-9">
      <p className="mb-2 font-mono text-xs tracking-[0.25em] text-flame uppercase">SEC-08 · Contest</p>
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-neutral-50 sm:text-4xl">
          T-Shirt <span className="text-flame">Gallery</span>
        </h1>
        <div className="flex items-center gap-4 font-mono text-xs text-muted">
          <span>{count} designs</span>
          <a
            href={CONTEST.brief}
            target="_blank"
            rel="noreferrer"
            className="text-flame underline-offset-4 hover:underline"
          >
            Rules ↗
          </a>
        </div>
      </div>
    </section>
  );
}

export function GalleryPage() {
  const submissions = useSubmissions();

  return (
    <div className="min-h-full">
      <Header mode="gallery" />
      <GalleryIntro count={submissions.length} />

      <main className="page-shell pb-16 sm:pb-20">
        {submissions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mx-auto max-w-6xl columns-1 gap-5 sm:columns-2">
            {submissions.map((submission) => (
              <GalleryCard key={submission.id} submission={submission} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
