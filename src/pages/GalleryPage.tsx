import { CONTEST } from "../config";
import { useSubmissions } from "../hooks";
import { EmptyState } from "../components/EmptyState";
import { GalleryCard } from "../components/GalleryCard";
import { Header } from "../components/Header";

function GalleryIntro({ count }: { count: number }) {
  return (
    <section className="page-shell flex flex-wrap items-end justify-between gap-x-8 gap-y-4 pb-10 pt-9 sm:pb-14 sm:pt-12">
      <div>
        <p className="mb-2 font-mono text-[11px] tracking-[0.32em] text-flame/75 uppercase">
          SEC-08 · SovEng
        </p>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-neutral-50 sm:text-4xl lg:text-[2.75rem]">
          T-Shirt Gallery
        </h1>
      </div>
      <div className="flex items-center gap-5 font-mono text-xs text-muted">
        <span>{count} designs</span>
        <a
          href={CONTEST.brief}
          target="_blank"
          rel="noreferrer"
          className="text-flame/90 underline-offset-4 hover:text-flame hover:underline"
        >
          Rules ↗
        </a>
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

      <main className="page-shell pb-28 sm:pb-32">
        {submissions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-14 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-16 lg:gap-x-16 lg:gap-y-20 xl:max-w-7xl xl:grid-cols-3 xl:gap-x-12">
            {submissions.map((submission, index) => (
              <GalleryCard key={submission.id} submission={submission} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
