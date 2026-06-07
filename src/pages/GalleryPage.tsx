import { CONTEST } from "../config";
import { useSubmissions } from "../hooks";
import { EmptyState } from "../components/EmptyState";
import { GalleryCard } from "../components/GalleryCard";
import { Header } from "../components/Header";

function GalleryMeta({ count }: { count: number }) {
  return (
    <section className="page-shell flex items-center justify-between gap-4 pb-5 pt-5 font-mono text-xs text-muted sm:pb-6">
      <span>{count} designs</span>
      <a
        href={CONTEST.brief}
        target="_blank"
        rel="noreferrer"
        className="text-flame underline-offset-4 hover:underline"
      >
        Rules ↗
      </a>
    </section>
  );
}

export function GalleryPage() {
  const submissions = useSubmissions();

  return (
    <div className="min-h-full">
      <Header mode="gallery" />
      <GalleryMeta count={submissions.length} />

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
