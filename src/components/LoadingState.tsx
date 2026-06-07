const skeletonHeights = [320, 420, 280, 380, 300, 360];

export function GallerySkeleton() {
  return (
    <div
      className="mx-auto max-w-6xl columns-1 gap-5 sm:columns-2"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading submissions"
    >
      {skeletonHeights.map((height, index) => (
        <div
          key={index}
          className="mb-5 break-inside-avoid overflow-hidden rounded-xl border border-edge bg-panel-2 animate-pulse"
        >
          <div className="bg-edge/40" style={{ height }} />
          <div className="flex items-center justify-between gap-2 px-2.5 py-2">
            <div className="h-5 w-24 rounded bg-edge/40" />
            <div className="h-4 w-16 rounded bg-edge/40" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function JudgesSkeleton() {
  return (
    <div
      className="flex flex-col gap-16 sm:gap-20"
      aria-live="polite"
      aria-busy="true"
      aria-label="Loading submissions"
    >
      {[0, 1, 2].map((index) => (
        <div key={index} className="animate-pulse rounded-xl border border-edge bg-panel-2">
          <div className="h-72 bg-edge/40 sm:h-96" />
          <div className="space-y-3 px-4 py-5">
            <div className="h-5 w-32 rounded bg-edge/40" />
            <div className="h-4 w-full max-w-md rounded bg-edge/40" />
          </div>
        </div>
      ))}
    </div>
  );
}
