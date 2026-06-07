import { useSubmissions } from "../hooks";
import { EmptyState } from "../components/EmptyState";
import { GalleryCard } from "../components/GalleryCard";
import { Header } from "../components/Header";

export function GalleryPage() {
  const submissions = useSubmissions();

  return (
    <div className="min-h-full">
      <Header mode="gallery" />

      <main className="page-shell pb-16 pt-5 sm:pb-20 sm:pt-6">
        {submissions.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <p className="mb-5 font-mono text-xs text-muted sm:mb-6">{submissions.length} designs</p>
            <div className="mx-auto max-w-6xl columns-1 gap-5 sm:columns-2">
              {submissions.map((submission) => (
                <GalleryCard key={submission.id} submission={submission} />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
