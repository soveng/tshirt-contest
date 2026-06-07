import { CONTEST } from "../config";
import { useSubmissions } from "../hooks";
import { EmptyState } from "../components/EmptyState";
import { GalleryCard } from "../components/GalleryCard";
import { Header } from "../components/Header";

function GalleryIntro({ count }: { count: number }) {
  return (
    <section className="page-shell max-w-2xl pt-8 pb-10 sm:pt-12 sm:pb-12">
      <p className="mb-3 font-mono text-xs tracking-[0.25em] text-flame uppercase">SEC-08 · Contest</p>
      <h1 className="font-display text-4xl leading-[0.95] font-extrabold tracking-tight text-neutral-50 sm:text-5xl lg:text-6xl">
        T-Shirt Design <span className="text-flame">Gallery</span>
      </h1>
      <p className="mt-5 max-w-xl text-base leading-relaxed text-muted">
        Mockups submitted on Nostr with{" "}
        <a
          href="https://ants.sh/t/SovEng"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-neutral-200 underline-offset-4 hover:text-flame hover:underline"
        >
          #SovEng
        </a>
        .
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

export function GalleryPage() {
  const submissions = useSubmissions();

  return (
    <div className="min-h-full">
      <Header mode="gallery" />
      <GalleryIntro count={submissions.length} />

      <main className="page-shell max-w-6xl pb-24">
        {submissions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-8 xl:grid-cols-3">
            {submissions.map((submission, index) => (
              <GalleryCard key={submission.id} submission={submission} index={index} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
