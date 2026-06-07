export function EmptyState() {
  return (
    <div className="page-shell max-w-xl py-24">
      <img src="/flame.svg" alt="" width={40} height={40} className="mb-4 opacity-60" />
      <p className="text-neutral-300">No submissions yet.</p>
      <p className="mt-2 text-sm text-muted">
        Post a mockup on Nostr with{" "}
        <a
          href="https://ants.sh/t/SovEng"
          target="_blank"
          rel="noreferrer"
          className="font-mono text-neutral-300 underline-offset-4 hover:text-flame hover:underline"
        >
          #SovEng
        </a>{" "}
        and it will show up here.
      </p>
    </div>
  );
}
