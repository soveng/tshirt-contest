import { useMemo, useState } from "react";

import { useSubmissions } from "../hooks";
import { EmptyState } from "../components/EmptyState";
import { GalleryCard } from "../components/GalleryCard";
import { Header } from "../components/Header";
import type { SortOption } from "../components/SortMenu";

function shuffle<T>(items: T[]): T[] {
  const list = [...items];
  for (let i = list.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [list[i], list[j]] = [list[j], list[i]];
  }
  return list;
}

export function GalleryPage() {
  const submissions = useSubmissions();
  const [sort, setSort] = useState<SortOption>("newest");
  const [seed, setSeed] = useState(0);

  const ordered = useMemo(() => {
    if (sort === "oldest") return [...submissions].reverse();
    if (sort === "random") return shuffle(submissions);
    return submissions;
    // seed forces a reshuffle when Random is picked again
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissions, sort, seed]);

  function handleSort(next: SortOption) {
    if (next === "random") setSeed((s) => s + 1);
    setSort(next);
  }

  return (
    <div className="min-h-full">
      <Header
        mode="gallery"
        submissionCount={submissions.length}
        sort={sort}
        onSortChange={handleSort}
      />

      <main className="page-shell pb-16 pt-5 sm:pb-20 sm:pt-6">
        {submissions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="mx-auto max-w-6xl columns-1 gap-5 sm:columns-2">
            {ordered.map((submission) => (
              <GalleryCard key={submission.id} submission={submission} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
